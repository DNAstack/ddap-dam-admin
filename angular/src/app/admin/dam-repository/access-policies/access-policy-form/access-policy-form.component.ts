import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { EntityModel, Form } from 'ddap-common-lib';

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
    return this.form.get('variableDefinitions') as FormArray;
  }

  @Input()
  accessPolicy?: EntityModel = new EntityModel('', Policy.create());

  form: FormGroup;

  constructor(public accessPolicyFormBuilder: AccessPolicyFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
  }

  getModel(): EntityModel {
    const { id, ui, anyOf, variableDefinitions } = this.form.value;
    const accessPolicy: Policy = Policy.create({
      ui,
      anyOf,
      variableDefinitions: this.getVariableDefinitionsModel(variableDefinitions),
    });

    return new EntityModel(id, accessPolicy);
  }

  getVariableDefinitionsModel(variableDefinitions: any[]): { [key: string]: IVariableFormat } {
    const variableDefinitionsModel = {};
    variableDefinitions.forEach((variableDefinition) => {
      const { id, ...rest } = variableDefinition;
      variableDefinitionsModel[id] = { ...rest };
    });
    return variableDefinitionsModel;
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  addVariable() {
    this.variableDefinitions.insert(0, this.accessPolicyFormBuilder.buildVariableDefinitionForm());
  }

  removeVariable(index: number) {
    this.variableDefinitions.removeAt(index);
  }

}
