import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EntityModel, FormValidationService, isExpanded } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { dam } from '../../../../../shared/proto/dam-service';
import { AccessPoliciesStore } from '../../../access-policies/access-policies.store';
import { ServiceDefinitionService } from '../../../service-definitions/service-definitions.service';
import { ServiceDefinitionsStore } from '../../../service-definitions/service-definitions.store';
import View = dam.v1.View;
import { PolicyVariableDialogComponent } from '../../policy-variable-dialog/policy-variable-dialog.component';
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
    if (!this.templates) {
      return null;
    }
    return this.templates.find(this.equalToSelectedTemplateName);
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
  templates: EntityModel[];
  templatesSubscription: Subscription;
  policyValues$: Observable<string[]>;
  policiesDetail: object = {};

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

    this.templatesSubscription = this.serviceDefinitionsStore.getAsList()
      .subscribe((templates) => {
        this.templates = templates;
        if (this.selectedTemplate) {
          this.rebuildPoliciesForRolesForm();
          this.rebuildVariablesForItemsForm();
        }
        // this.subscribeToFormChanges();
      });

    this.policyValues$ = this.accessPoliciesStore.getAsList()
      .pipe(
        map((policies: EntityModel[]) => {
          return policies.map((policy) => {
            this.policiesDetail[policy.name] = policy['dto']['variableDefinitions'];
            return policy.name;
          });
        })
      );
  }

  ngOnDestroy(): void {
    this.templatesSubscription.unsubscribe();
  }

  isDefaultRole(roleId: string) {
    return this.viewForm.get('defaultRole').value === roleId;
  }

  makeDefaultRole(roleId: string) {
    this.viewForm.get('defaultRole').setValue(roleId);
  }

  serviceTemplateChange() {
    this.rebuildPoliciesForRolesForm();
    this.rebuildVariablesForItemsForm();
  }

  rebuildPoliciesForRolesForm(): void {
    const roles: string[] = Object.keys(_get(this.selectedTemplate, 'dto.roles', []));
    const rolesFormGroup: FormGroup = this.formBuilder.group({});
    roles.forEach((role) => {
      rolesFormGroup.addControl(role, this.formBuilder.group({
        policies: [this.getPoliciesForRole(role)],
      }));
    });

    this.viewForm.setControl('roles', rolesFormGroup);
  }

  rebuildVariablesForItemsForm(): void {
    this.getVariablesBySelectedTemplate().subscribe((vars) => {
      const varArray: FormArray = this.formBuilder.array([]);
      Object.entries(vars).forEach(([key, value]: any) => {
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

  policyAdd($event, roleId) {
    const { name } = $event;
    const variables = this.policiesDetail[name];
    const policyVarsForm = this.policyVarsForm();
    if (variables) {
      policyVarsForm.varsFormGroup = this.createPolicyVariablesForm(variables, this.getPolicyDetails(name, roleId));
      const dialogRef = this.dialog.open(PolicyVariableDialogComponent, {
        width: '30rem',
        data: {
          onClick: () => this.addPolicyVariables(policyVarsForm, name, roleId, dialogRef),
          variables,
          varsFormGroup : policyVarsForm.varsFormGroup,
        },
      });
    }
  }

  splitPatternValidators(pattern) {
    return [Validators.pattern(pattern)];
  }

  private getPoliciesForRole(roleId: string): string[] {
    return _get(this.view, `dto.roles[${roleId}].policies`, []);
  }

  private getValueForVariable(variableId: string, variableType: string): string | string[] {
    let variableValue = _get(this.view, `dto.items[0].vars[${variableId}]`, '');
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

  private createPolicyVariablesForm(variables, policyDetails) {
    const varsFormGroup = this.formBuilder.group({});
    Object.keys(variables).map(controlName => {
      varsFormGroup.addControl(controlName,
        this.formBuilder.control((policyDetails && policyDetails['vars']) ? policyDetails['vars'][controlName] : '',
        [Validators.required, Validators.pattern(variables[controlName]['regexp'])]));
    });
    return varsFormGroup;
  }

  private addPolicyVariables(policyVarsForm, policyName, roleId, dialogRef) {
    if (!this.validationService.validate(policyVarsForm)) {
      return;
    }
    const policies = this.viewForm.get(`roles.${roleId}.policies`).value;
    policies.map(policyDetail => {
      if (policyDetail['name'] === policyName) {
        policyDetail['vars'] = policyVarsForm.varsFormGroup.value;
      }
    });
    this.viewForm.get(`roles.${roleId}.policies`).patchValue(policies);
    dialogRef.close();
  }

  private getPolicyDetails(policyName, roleId: string) {
    return this.getPoliciesForRole(roleId).find(policy => policy['name'] === policyName);
  }

  private policyVarsForm() {
    const varsFormGroup = this.formBuilder.group({});
    return {
      varsFormGroup,
      getAllForms(): FormGroup[] {
        return [varsFormGroup];
      },

      isValid(): boolean {
        return varsFormGroup.valid;
      },
    };
  }

}
