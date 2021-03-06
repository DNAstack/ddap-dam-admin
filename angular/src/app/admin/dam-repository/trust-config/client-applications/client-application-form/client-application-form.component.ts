import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormValidators, isExpanded } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Observable, of, Subscription } from 'rxjs';

import { common } from '../../../../../shared/proto/dam-service';
import { generateInternalName } from '../../../shared/internal-name.util';

import { ClientApplicationFormBuilder } from './client-application-form-builder.service';

import Client = common.Client;

@Component({
  selector: 'ddap-client-application-form',
  templateUrl: './client-application-form.component.html',
  styleUrls: ['./client-application-form.component.scss'],
})
export class ClientApplicationFormComponent implements OnInit, OnDestroy, Form {

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
  internalNameEditable = false;
  @Input()
  clientApplication?: EntityModel = new EntityModel('', Client.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isExpanded: Function = isExpanded;
  grantTypeValues: Observable<string[]> = of(['authorization_code', 'refresh_token', 'client_credentials']);
  responseTypeValues: Observable<string[]> = of(['code', 'token', 'id_token']);

  constructor(private clientApplicationFormBuilder: ClientApplicationFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.clientApplicationFormBuilder.buildForm(this.clientApplication);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
    const { id, grantTypes, redirectUris, responseTypes, ...rest } = this.form.value;
    const clientApplication: Client = Client.create({
      grantTypes: this.removeEmptyValues(grantTypes),
      redirectUris: this.removeEmptyValues(redirectUris),
      responseTypes: this.removeEmptyValues(responseTypes),
      ...rest,
    });

    return new EntityModel(id, clientApplication);
  }

  removeEmptyValues(values: string[]) {
    return values.filter(value => value.length > 0);
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
