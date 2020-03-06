import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormValidators, isExpanded } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';

import { common } from '../../../../../shared/proto/dam-service';

import Client = common.Client;
import { ClientApplicationFormBuilder } from './client-application-form-builder.service';

@Component({
  selector: 'ddap-client-application-form',
  templateUrl: './client-application-form.component.html',
  styleUrls: ['./client-application-form.component.scss'],
})
export class ClientApplicationFormComponent implements OnInit, Form {

  get redirectUris() {
    return this.form.get('redirectUris') as FormArray;
  }

  get grantTypes() {
    return this.form.get('grantTypes') as FormArray;
  }

  get responseTypes() {
    return this.form.get('responseTypes') as FormArray;
  }

  @Input()
  clientApplication?: EntityModel = new EntityModel('', Client.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private clientApplicationFormBuilder: ClientApplicationFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.clientApplicationFormBuilder.buildForm(this.clientApplication);
  }

  addRedirectUri(): void {
    const firstControl = this.getFirstControl(this.redirectUris);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.redirectUris.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required, FormValidators.url]));
  }

  addGrantType(): void {
    const firstControl = this.getFirstControl(this.grantTypes);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.grantTypes.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required]));
  }

  addResponseType(): void {
    const firstControl = this.getFirstControl(this.responseTypes);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.responseTypes.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required]));
  }

  getModel(): EntityModel {
    const { id, ...rest } = this.form.value;
    const clientApplication: Client = Client.create({
      ...rest,
    });

    return new EntityModel(id, clientApplication);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  private getFirstControl(formControls: FormArray): AbstractControl {
    return formControls.at(0);
  }

}
