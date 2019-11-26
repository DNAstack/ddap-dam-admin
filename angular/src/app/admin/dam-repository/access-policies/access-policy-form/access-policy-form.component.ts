import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityModel, Form } from 'ddap-common-lib';

import { dam } from '../../../../shared/proto/dam-service';

import Policy = dam.v1.Policy;
import { AccessPolicyFormBuilder } from './access-policy-form-builder.service';

@Component({
  selector: 'ddap-access-policy-form',
  templateUrl: './access-policy-form.component.html',
  styleUrls: ['./access-policy-form.component.scss'],
})
export class AccessPolicyFormComponent implements OnInit, Form {

  @Input()
  accessPolicy?: EntityModel = new EntityModel('', Policy.create());

  form: FormGroup;

  constructor(public accessPolicyFormBuilder: AccessPolicyFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
  }

  getModel(): EntityModel {
    const { id, ui, anyOf } = this.form.value;
    const accessPolicy: Policy = Policy.create({
      ui,
      anyOf,
    });

    return new EntityModel(id, accessPolicy);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

}
