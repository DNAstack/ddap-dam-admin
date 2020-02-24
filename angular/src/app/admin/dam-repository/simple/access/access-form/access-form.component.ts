import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { alignControlsWithModelDefinitions, EntityModel, Form, isExpanded, removeInternalFields } from 'ddap-common-lib';

import { dam } from '../../../../../shared/proto/dam-service';
import { ConditionFormComponent } from '../../../shared/condition-form/condition-form.component';

import { AccessFormBuilder } from './access-form-builder.service';

import Policy = dam.v1.Policy;

@Component({
  selector: 'ddap-access-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.scss'],
})
export class AccessFormComponent implements OnInit, Form {

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(public accessFormBuilder: AccessFormBuilder) {
  }

  ngOnInit(): void {
    // this.form = this.accessPolicyFormBuilder.buildForm(this.accessPolicy);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }



}
