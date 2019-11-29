import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { alignControlsWithModelDefinitions, EntityModel, Form, removeInternalFields } from 'ddap-common-lib';

import { dam } from '../../../../shared/proto/dam-service';

import Policy = dam.v1.Policy;
import { AccessPolicyFormBuilder } from './access-policy-form-builder.service';
import IVariableFormat = dam.v1.IVariableFormat;

@Component({
  selector: 'ddap-access-policy-form',
  templateUrl: './access-policy-form.component.html',
  styleUrls: ['./access-policy-form.component.scss'],
})
export class AccessPolicyFormComponent implements OnInit, Form {

  get variableDefinitions() {
    return this.form.get('variableDefinitions') as FormGroup;
  }

  @Input()
  accessPolicy?: EntityModel = new EntityModel('', Policy.create());

  form: FormGroup;
  counter = 1;

  constructor(public accessPolicyFormBuilder: AccessPolicyFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
  }

  getModel(): EntityModel {
    alignControlsWithModelDefinitions([this.variableDefinitions]);

    const { id, variableDefinitions, ...rest } = this.form.value;
    const accessPolicy: Policy = Policy.create({
      variableDefinitions: removeInternalFields(variableDefinitions, ['id']),
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
