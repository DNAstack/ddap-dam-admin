import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { alignControlsWithModelDefinitions, EntityModel, Form, isExpanded, removeInternalFields } from 'ddap-common-lib';
import { Subscription } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import { ConditionFormComponent } from '../../../shared/condition-form/condition-form.component';
import { generateInternalName } from '../../../shared/internal-name.util';

import { AccessPolicyFormBuilder } from './access-policy-form-builder.service';

import Policy = dam.v1.Policy;

@Component({
  selector: 'ddap-access-policy-form',
  templateUrl: './access-policy-form.component.html',
  styleUrls: ['./access-policy-form.component.scss'],
})
export class AccessPolicyFormComponent implements OnInit, OnDestroy, Form {

  get variableDefinitions() {
    return this.form.get('variableDefinitions') as FormGroup;
  }

  @ViewChild(ConditionFormComponent)
  conditionForm: ConditionFormComponent;

  @Input()
  internalNameEditable = false;
  @Input()
  accessPolicy?: EntityModel = new EntityModel('', Policy.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isExpanded: Function = isExpanded;
  counter = 1;
  conditionsComponentLabels = {
    header: 'Scenarios for Access',
    description: 'Scenarios are lists of requirements that are matched against visas. A scenario is met if all its inner requirements are met. A policy is met, if one or more of its scenarios are met.',
    addBtn: 'Add Scenario',
    removeBtn: 'Remove Scenario',
  };

  constructor(public accessPolicyFormBuilder: AccessPolicyFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').patchValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getModel(): EntityModel {
    alignControlsWithModelDefinitions([this.variableDefinitions]);

    const { id, variableDefinitions, anyOf, ...rest } = this.form.value;
    const accessPolicy: Policy = Policy.create({
      variableDefinitions: removeInternalFields(variableDefinitions, ['id']),
      anyOf: this.conditionForm.getModel(),
      ...rest,
    });

    return new EntityModel(id, accessPolicy);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  addVariable() {
    const controlId = `UNDEFINED_VARIABLE_${this.counter}`;
    this.variableDefinitions.addControl(controlId, this.accessPolicyFormBuilder.buildVariableDefinitionForm(controlId));
    this.counter += 1;
  }

  removeVariable(id: string) {
    this.variableDefinitions.removeControl(id);
  }

}
