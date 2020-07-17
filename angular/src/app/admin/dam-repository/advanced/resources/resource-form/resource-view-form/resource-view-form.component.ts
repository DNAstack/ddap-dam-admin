import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EntityModel, FormValidationService, isExpanded } from 'ddap-common-lib';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';
import { Subscription } from 'rxjs';
import Item = dam.v1.View.Item;
import { debounceTime } from 'rxjs/operators';

import { dam } from '../../../../../../shared/proto/dam-service';
import { AccessPoliciesStore } from '../../../access-policies/access-policies.store';
import { ServiceDefinitionService } from '../../../service-definitions/service-definitions.service';
import { ServiceDefinitionsStore } from '../../../service-definitions/service-definitions.store';
import IViewPolicy = dam.v1.ViewRole.IViewPolicy;
import ViewPolicy = dam.v1.ViewRole.ViewPolicy;
import { TargetAdapterVariables } from '../../../target-adapters/target-adapter-variables.model';
import { ResourceFormBuilder } from '../resource-form-builder.service';


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
    const equalToSelectedTemplateName = (template) => template.name === this.viewForm.get('serviceTemplate').value;

    if (!this.serviceDefinitions) {
      return null;
    }
    return this.serviceDefinitions.find(equalToSelectedTemplateName);
  }

  get items() {
    return this.viewForm.get('items') as FormArray;
  }

  @Input()
  viewForm: FormGroup;

  isExpanded: Function = isExpanded;
  serviceDefinitions: EntityModel[];
  serviceDefinitionStoreSubscription: Subscription;
  policies: EntityModel[];
  targetAdapterVariables: TargetAdapterVariables;

  constructor(private formBuilder: FormBuilder,
              private resourceFormBuilder: ResourceFormBuilder,
              public serviceDefinitionService: ServiceDefinitionService,
              private serviceDefinitionsStore: ServiceDefinitionsStore,
              private accessPoliciesStore: AccessPoliciesStore,
              public dialog: MatDialog,
              protected validationService: FormValidationService) {
  }

  ngOnInit() {
    this.serviceDefinitionStoreSubscription = this.serviceDefinitionsStore.getAsList()
      .subscribe((serviceDefinitions) => {
        this.serviceDefinitions = serviceDefinitions;
        if (this.selectedTemplate) {
          this.serviceDefinitionService.getTargetAdapterVariables(this.selectedTemplate.name)
            .subscribe((targetAdapterVariables) => {
              this.targetAdapterVariables = targetAdapterVariables;
              this.addMissingVariablesToFormFromTargetAdapterVariables();
            });

          this.addMissingRolesToFormFromServiceDefinition();
        }
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
    this.serviceDefinitionService.getTargetAdapterVariables(this.selectedTemplate.name)
      .subscribe((targetAdapterVariables) => {
        this.targetAdapterVariables = targetAdapterVariables;
        this.rebuildVariablesForItemsForm();
      });

    this.addMissingRolesToFormFromServiceDefinition();
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

  splitPatternValidators(pattern) {
    return [Validators.pattern(pattern)];
  }

  isAnyOfControlsInvalid(paths: string[]) {
    return paths.some((path) => !this.viewForm.get(path) || this.viewForm.get(path).invalid);
  }

  isSplitPattern(policyVariable: string, policyName: string): boolean {
    const policyDefinition: EntityModel = this.policies.find((policy) => policy.name === policyName);
    if (policyDefinition) {
      const { variableDefinitions } = policyDefinition.dto;
      return variableDefinitions[policyVariable] && variableDefinitions[policyVariable].type
        ? variableDefinitions[policyVariable].type === 'split_pattern' : false;
    }
    return false;
  }

  private addMissingVariablesToFormFromTargetAdapterVariables() {
    Object.entries(this.targetAdapterVariables)
      .forEach(([variableId, variableFormat]) => {
        const numberOfItems = this.items.length;
        for (let i = 0; i < numberOfItems; i++) {
          const variableControl = this.items.get(`${i}.args.${variableId}`);
          if (!variableControl) {
            const args = this.items.get(`${i}.args`) as FormGroup;
            // TODO: figure out how to make validators work with split_pattern input
            //       (not a high priority since DAM is validating our inputs on submit and sending description back to us)
            args.addControl(variableId, this.formBuilder.control(undefined));
          }
        }
      });
  }

  private rebuildVariablesForItemsForm() {
    this.items.clear();
    const args = {};
    Object.keys(this.targetAdapterVariables)
      .forEach((variableId) => {
        args[variableId] = undefined;
      });
    this.items.push(this.resourceFormBuilder.buildItemForm(Item.create({ args })));
  }
}
