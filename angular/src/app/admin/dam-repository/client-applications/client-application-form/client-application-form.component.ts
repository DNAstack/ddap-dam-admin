import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormValidators, isExpanded } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';

import { common } from '../../../../shared/proto/dam-service';

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
    this.redirectUris.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required, FormValidators.url]));
  }

  removeRedirectUri(index: number): void {
    this.redirectUris.removeAt(index);
  }

  addGrantType(): void {
    this.grantTypes.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required]));
  }

  removeGrantType(index: number): void {
    this.grantTypes.removeAt(index);
  }

  addResponseType(): void {
    this.responseTypes.insert(0, this.clientApplicationFormBuilder.buildStringControl(null, [Validators.required]));
  }

  removeResponseType(index: number): void {
    this.responseTypes.removeAt(index);
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

}
