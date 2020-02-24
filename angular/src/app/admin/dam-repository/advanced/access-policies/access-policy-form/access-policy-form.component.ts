import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { alignControlsWithModelDefinitions, EntityModel, Form, isExpanded, removeInternalFields } from 'ddap-common-lib';

import { dam } from '../../../../../shared/proto/dam-service';
import { ConditionFormComponent } from '../../../shared/condition-form/condition-form.component';

import { AccessPolicyFormBuilder } from './access-policy-form-builder.service';

import Policy = dam.v1.Policy;

@Component({
  selector: 'ddap-access-policy-form',
  templateUrl: './access-policy-form.component.html',
  styleUrls: ['./access-policy-form.component.scss'],
})
export class AccessPolicyFormComponent implements OnInit, Form {

  get variableDefinitions() {
    return this.form.get('variableDefinitions') as FormGroup;
  }

  @ViewChild(ConditionFormComponent, { static: false })
  conditionForm: ConditionFormComponent;

  @Input()
  accessPolicy?: EntityModel = new EntityModel('', Policy.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;
  counter = 1;

  constructor(public accessPolicyFormBuilder: AccessPolicyFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
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
