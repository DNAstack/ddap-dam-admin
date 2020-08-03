import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { alignControlsWithModelDefinitions, EntityModel, isExpanded, removeInternalFields } from 'ddap-common-lib';
import { Subscription } from 'rxjs';
import { dam } from 'src/app/shared/proto/dam-service';

import ServiceTemplate = dam.v1.ServiceTemplate;
import IServiceDescriptor = dam.v1.IServiceDescriptor;
import { generateInternalName } from '../../../shared/internal-name.util';
import { TargetAdaptersService } from '../../target-adapters/target-adapters.service';
import { ServiceDefinitionService } from '../service-definitions.service';
import { VariablesDialogComponent } from '../variables-dialog/variables-dialog.component';

import { ServiceDefinitionFormBuilder } from './service-definition-form-builder.service';
import IVariableFormat = dam.v1.IVariableFormat;

@Component({
  selector: 'ddap-service-definition-form',
  templateUrl: './service-definition-form.component.html',
  styleUrls: ['./service-definition-form.component.scss'],
})
export class ServiceDefinitionFormComponent implements OnInit, OnDestroy {

  get interfaces() {
    return this.form.get('interfaces') as FormGroup;
  }

  get roles() {
    return this.form.get('roles') as FormGroup;
  }

  get selectedTargetAdapter(): IServiceDescriptor | null {
    return this.serviceDescriptors
           ? this.serviceDescriptors[this.form.get('serviceName').value]
           : null;
  }

  get itemFormat() {
    return this.form.get('itemFormat') as FormControl;
  }

  @Input()
  internalNameEditable = false;
  @Input()
  serviceTemplate?: EntityModel = new EntityModel( '' , ServiceTemplate.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isExpanded: Function = isExpanded;
  interfaceCounter = 1;
  roleCounter = 1;
  serviceDescriptors: IServiceDescriptor[];
  selectedTargetAdapterVariables: { [key: string]: IVariableFormat };

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private serviceDefinitionFormBuilder: ServiceDefinitionFormBuilder,
              private serviceDefinitionService: ServiceDefinitionService,
              private targetAdaptersService: TargetAdaptersService) {
  }

  ngOnInit() {
    this.targetAdaptersService.getTargetAdapters()
      .subscribe((targetAdapters: IServiceDescriptor[]) => {
        this.serviceDescriptors = targetAdapters;
        this.targetAdapterChange();
      });

    this.form = this.serviceDefinitionFormBuilder.buildForm(this.serviceTemplate);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  addInterface() {
    const controlId = `UNDEFINED_INTERFACE_${this.interfaceCounter}`;
    this.interfaces.addControl(controlId, this.serviceDefinitionFormBuilder.buildInterfaceForm(controlId));
    this.interfaceCounter += 1;
  }

  removeInterface(id: string) {
    this.interfaces.removeControl(id);
  }

  addRole() {
    const controlId = `UNDEFINED_ROLE_${this.roleCounter}`;
    this.roles.addControl(controlId, this.serviceDefinitionFormBuilder.buildServiceRoleForm(controlId));
    this.roleCounter += 1;

    this.subscriptions.push(this.roles.get(controlId).get('ui.label').valueChanges
      .subscribe((displayName) => {
        this.roles.get(controlId).get('id').setValue(generateInternalName(displayName));
      }));
  }

  removeRole(id: string) {
    this.roles.removeControl(id);
  }

  targetAdapterChange() {
    if (!this.selectedTargetAdapter) {
      return;
    }

    this.selectedTargetAdapterVariables = this.selectedTargetAdapter['itemVariables'];
  }

  isRequired(fieldName: string): boolean {
    // FIXME
    return false;
  }

  getModel(): EntityModel {
    alignControlsWithModelDefinitions([this.roles, this.interfaces]);

    const { id, roles, interfaces, ...rest } = this.form.value;
    const updatedRoles = this.removeEmptyServiceArgs(roles);
    return new EntityModel(id, {
      roles: removeInternalFields(updatedRoles, ['id']),
      interfaces: this.getInterfacesModel(interfaces),
      ...rest,
    });
  }

  showAutocompleteDropdown({ value }): boolean {
    return !value || value.length < 1;
  }

  showVariables(interfaceKey) {
    this.dialog.open(VariablesDialogComponent, {
      data: {
        variables: this.selectedTargetAdapterVariables,
        interfaceKey,
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.updateVariable(response.selectedVariable, interfaceKey);
        }
      });
  }

  updateVariable = (selectedVariable, interfaceKey) => {
    if (this.form.get(`interfaces.${interfaceKey}`)) {
      const interfaceValue = this.form.get(`interfaces.${interfaceKey}.value`).value || '';
      this.form.get(`interfaces.${interfaceKey}.value`).patchValue(interfaceValue + '${' + selectedVariable + '}');
    }
  }

  private getInterfacesModel(interfaces: { [ key: string]: string }) {
    const interfacesModel = {};
    if (interfaces) {
      Object.values(interfaces)
        .forEach((interfaceValue: any) => {
          interfacesModel[interfaceValue.id] = interfaceValue.value;
        });
    }
    return interfacesModel;
  }

  private updateRoleValidations() {
    Object.entries(this.roles.controls)
      .forEach(([_, roleControl]: any) => {
        const roleValidators = this.isRequired('targetRole') ? [Validators.required] : [];
        const scopeValidators = this.isRequired('targetScope') ? [Validators.required] : [];

        roleControl.controls['targetRoles'].setValidators(roleValidators);
        roleControl.controls['targetScopes'].setValidators(scopeValidators);

        roleControl.controls['targetRoles'].updateValueAndValidity();
        roleControl.controls['targetScopes'].updateValueAndValidity();
      });
  }

  // removes empty serviceArgs TODO DISCO-2744
  private removeEmptyServiceArgs(roles: any) {
    for (const [role, roleDetails] of Object.entries(roles)) {
      const serviceArgs = roleDetails['serviceArgs'];
      if (serviceArgs) {
        for (const[arg, argValue] of Object.entries(serviceArgs)) {
          if (argValue['values'].length === 0) {
           delete serviceArgs[arg];
          }
        }
      }
    }
    return roles;
  }
}
