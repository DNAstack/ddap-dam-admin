import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { alignControlsWithModelDefinitions, EntityModel, isExpanded, removeInternalFields } from 'ddap-common-lib';
import { dam } from 'src/app/shared/proto/dam-service';

import { TargetAdaptersService } from '../../target-adapters/target-adapters.service';
import { ServiceDefinitionService } from '../service-definitions.service';
import { VariablesDialogComponent } from '../variables-dialog/variables-dialog.component';

import { ServiceDefinitionFormBuilder } from './service-definition-form-builder.service';
import ServiceTemplate = dam.v1.ServiceTemplate;

import ITargetAdapter = dam.v1.ITargetAdapter;

@Component({
  selector: 'ddap-service-definition-form',
  templateUrl: './service-definition-form.component.html',
  styleUrls: ['./service-definition-form.component.scss'],
})
export class ServiceDefinitionFormComponent implements OnInit {

  get interfaces() {
    return this.form.get('interfaces') as FormGroup;
  }

  get roles() {
    return this.form.get('roles') as FormGroup;
  }

  get selectedTargetAdapter(): ITargetAdapter | null {
    return this.targetAdapters
           ? this.targetAdapters[this.form.get('targetAdapter').value]
           : null;
  }

  get itemFormat() {
    return this.form.get('itemFormat') as FormControl;
  }

  @Input()
  serviceTemplate?: EntityModel = new EntityModel( '' , ServiceTemplate.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;
  interfaceCounter = 1;
  roleCounter = 1;
  targetAdapters: ITargetAdapter[];
  requirements: object;
  variables: string[] = [];

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private serviceDefinitionFormBuilder: ServiceDefinitionFormBuilder,
              private serviceDefinitionService: ServiceDefinitionService,
              private targetAdaptersService: TargetAdaptersService) {
  }

  ngOnInit() {
    this.targetAdaptersService.getTargetAdapters()
      .subscribe((targetAdapters: ITargetAdapter[]) => {
        this.targetAdapters = targetAdapters;
        this.targetAdapterChange();
        this.itemFormatChange();
      });

    this.form = this.serviceDefinitionFormBuilder.buildForm(this.serviceTemplate);
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
  }

  removeRole(id: string) {
    this.roles.removeControl(id);
  }

  targetAdapterChange() {
    if (!this.selectedTargetAdapter) {
      return;
    }

    this.requirements = this.selectedTargetAdapter.requirements;
    this.updateRoleValidations();
  }

  isRequired(fieldName: string): boolean {
    return this.requirements && fieldName in this.requirements;
  }

  getModel(): EntityModel {
    alignControlsWithModelDefinitions([this.roles, this.interfaces]);

    const { id, roles, interfaces, ...rest } = this.form.value;
    return new EntityModel(id, {
      roles: removeInternalFields(roles, ['id']),
      interfaces: this.getInterfacesModel(interfaces),
      ...rest,
    });
  }

  showAutocompleteDropdown({ value }): boolean {
    return !value || value.length < 1;
  }

  itemFormatChange() {
    if (!this.selectedTargetAdapter) {
      return;
    }
    const variables = this.selectedTargetAdapter['itemFormats'][this.itemFormat.value]['variables'];
    if (variables) {
      this.variables = Object.keys(variables);
    }
  }

  showVariables(interfaceKey) {
    this.dialog.open(VariablesDialogComponent, {
      data: {variables: this.variables, updateVariable: this.updateVariable, interfaceKey},
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
        const roleValidators = (this.requirements && this.requirements['targetRole']) ? [Validators.required] : [];
        const scopeValidators = (this.requirements && this.requirements['targetScope']) ? [Validators.required] : [];

        roleControl.controls['targetRoles'].setValidators(roleValidators);
        roleControl.controls['targetScopes'].setValidators(scopeValidators);

        roleControl.controls['targetRoles'].updateValueAndValidity();
        roleControl.controls['targetScopes'].updateValueAndValidity();
      });
  }
}
