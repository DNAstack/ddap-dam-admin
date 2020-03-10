import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EntityModel, FormValidationService, isExpanded } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { dam } from '../../../../../../shared/proto/dam-service';
import { AccessPoliciesStore } from '../../../access-policies/access-policies.store';
import { ServiceDefinitionService } from '../../../service-definitions/service-definitions.service';
import { ServiceDefinitionsStore } from '../../../service-definitions/service-definitions.store';
import View = dam.v1.View;
import { ResourceFormBuilder } from '../resource-form-builder.service';
import IViewPolicy = dam.v1.ViewRole.IViewPolicy;
import ViewPolicy = dam.v1.ViewRole.ViewPolicy;


@Component({
  selector: 'ddap-resource-view-form',
  templateUrl: './resource-view-form.component.html',
  styleUrls: ['./resource-view-form.component.scss'],
})
export class ResourceViewFormComponent implements OnInit, OnDestroy {

  get serviceTemplate(): string {
    return this.viewForm.get('serviceTemplate').value;
  }

  get selectedTemplate(): EntityModel {
    if (!this.serviceDefinitions) {
      return null;
    }
    return this.serviceDefinitions.find(this.equalToSelectedTemplateName);
  }

  get variableItems() {
    return this.viewForm.get('variables') as FormArray;
  }

  @Input()
  view: EntityModel;
  @Output()
  readonly formChange: EventEmitter<any> = new EventEmitter<any>();

  viewForm: FormGroup;
  isExpanded: Function = isExpanded;
  serviceDefinitions: EntityModel[];
  serviceDefinitionStoreSubscription: Subscription;
  policies: EntityModel[];

  constructor(private formBuilder: FormBuilder,
              private resourceFormBuilder: ResourceFormBuilder,
              private serviceDefinitionService: ServiceDefinitionService,
              private serviceDefinitionsStore: ServiceDefinitionsStore,
              private accessPoliciesStore: AccessPoliciesStore,
              public dialog: MatDialog,
              protected validationService: FormValidationService) {
  }

  ngOnInit() {
    if (!this.view || !this.view.name) {
      this.view = new EntityModel('', View.create());
    }

    this.viewForm = this.resourceFormBuilder.buildViewForm(this.view);

    this.serviceDefinitionStoreSubscription = this.serviceDefinitionsStore.getAsList()
      .subscribe((serviceDefinitions) => {
        this.serviceDefinitions = serviceDefinitions;
        if (this.selectedTemplate) {
          this.addMissingRolesToFormFromServiceDefinition();
          this.rebuildVariablesForItemsForm();
        }
        this.subscribeToFormChanges();
      });

    this.accessPoliciesStore.getAsList()
      .subscribe((policies) => {
        this.policies = policies;
      });
  }

  ngOnDestroy(): void {
    this.serviceDefinitionStoreSubscription.unsubscribe();
  }

  isDefaultRole(roleId: string) {
    return this.viewForm.get('defaultRole').value === roleId;
  }

  makeDefaultRole(roleId: string) {
    this.viewForm.get('defaultRole').setValue(roleId);
  }

  addPolicy(roleId: string) {
    this.getPolicyControls(roleId).insert(0, this.resourceFormBuilder.buildPolicyForm());
  }

  removePolicy(roleId: string, index: number) {
    this.getPolicyControls(roleId).removeAt(index);
  }

  addVariablesForPolicy(roleId: string, policyId: any) {
    const policyDefinition: EntityModel = this.policies.find((policy) => policy.name === policyId);

    // Reset variables for policy if it is not recognized policy name
    if (!policyDefinition) {
      const policyModel: IViewPolicy = ViewPolicy.create({
        name: policyId,
      });
      this.getPolicyControls(roleId).setControl(policyId, this.resourceFormBuilder.buildPolicyForm(policyModel));
      return;
    }

    const { variableDefinitions }: any = policyDefinition.dto;
    const policyVariables = {};
    if (variableDefinitions) {
      Object.keys(variableDefinitions)
        .forEach((variableKey) => {
          policyVariables[variableKey] = null;
        });
    }
    const fullPolicyModel: IViewPolicy = ViewPolicy.create({
      name: policyId,
      args: policyVariables,
    });
    this.getPolicyControls(roleId).setControl(policyId, this.resourceFormBuilder.buildPolicyForm(fullPolicyModel));
  }

  formatPolicyAutocompleteText(policyId: string): string {
    if (!policyId || !this.policies) {
      return;
    }
    const policyModel = this.policies.find((policy) => policy.name === policyId);
    return _get(policyModel, 'dto.ui.label', policyId);
  }

  serviceTemplateChange() {
    this.addMissingRolesToFormFromServiceDefinition();
    this.rebuildVariablesForItemsForm();
  }

  addMissingRolesToFormFromServiceDefinition() {
    const serviceDefRoles: any[] = this.selectedTemplate.dto.roles;

    Object.entries(serviceDefRoles)
      .forEach(([roleKey, role]: any) => {
      if (!this.viewForm.get(`roles.${roleKey}`)) {
        const rolesForm = this.viewForm.get('roles') as FormGroup;
        rolesForm.addControl(roleKey, this.resourceFormBuilder.buildRoleForm());
      }
    });
  }

  getPolicyControls(roleId: string): FormArray {
    const policies = this.viewForm.get(`roles.${roleId}.policies`);
    return policies ? policies as FormArray : this.formBuilder.array([]);
  }

  getPolicyVariables(variables: object): string[] {
    return Object.keys(variables);
  }

  rebuildVariablesForItemsForm(): void {
    this.getVariablesBySelectedTemplate().subscribe((args) => {
      const varArray: FormArray = this.formBuilder.array([]);
      Object.entries(args).forEach(([key, value]: any) => {
        const { ui, regexp, optional, type } = value;
        varArray.push(this.formBuilder.group({
          name: [key],
          label: [ui.label],
          description: [ui.description],
          optional: [optional],
          regexp: [regexp],
          type: [type],
          value: [this.getValueForVariable(key, type),
            (regexp && !optional && (type !== 'split_pattern')) ? [Validators.pattern(regexp)] : []],
        }));
      });

      this.viewForm.setControl('variables', varArray);
    });
  }

  getVariablesBySelectedTemplate(): Observable<any> {
    const serviceTemplateId = this.viewForm.get('serviceTemplate').value;
    return this.serviceDefinitionService.getTargetAdapterVariables(serviceTemplateId);
  }

  splitPatternValidators(pattern) {
    return [Validators.pattern(pattern)];
  }

  isAnyOfControlsInvalid(paths: string[]) {
    return paths.some((path) => !this.viewForm.get(path) || this.viewForm.get(path).invalid);
  }

  private getValueForVariable(variableId: string, variableType: string): string | string[] {
    let variableValue = _get(this.view, `dto.items[0].args[${variableId}]`, '');
    if (variableType === 'split_pattern' && variableValue.length > 0) {
      variableValue = variableValue.split(';');
    }
    return variableValue;
  }

  private equalToSelectedTemplateName = (template) => template.name === this.viewForm.get('serviceTemplate').value;

  private subscribeToFormChanges() {
    this.viewForm.valueChanges.pipe(
      debounceTime(300),
      tap((changed) => this.formChange.emit(changed))
    ).subscribe();
  }

}
