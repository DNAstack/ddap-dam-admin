import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityModel, Form } from 'ddap-common-lib';
import { Observable, Subscription } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import { pick } from '../../../shared/autocomplete.util';
import TrustedIssuer = dam.v1.TrustedIssuer;
import { generateInternalName } from '../../../shared/internal-name.util';
import { PassportTranslatorsService } from '../../passport-translators/passport-translators.service';
import { PassportIssuersStore } from '../passport-issuers.store';

import { PassportIssuerFormBuilder } from './passport-issuer-form-builder.service';

@Component({
  selector: 'ddap-passport-issuer-form',
  templateUrl: './passport-issuer-form.component.html',
  styleUrls: ['./passport-issuer-form.component.scss'],

})
export class PassportIssuerFormComponent implements OnInit, OnDestroy, Form {

  @Input()
  internalNameEditable = false;
  @Input()
  passportIssuer?: EntityModel = new EntityModel('', TrustedIssuer.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  passportIssuers$: Observable<any>;
  translators$: Observable<any>;
  clientCredentialsSet = false;

  constructor(
    private passportIssuerFormBuilder: PassportIssuerFormBuilder,
    private passportTranslators: PassportTranslatorsService,
    private passportIssuersStore: PassportIssuersStore
  ) {
  }

  ngOnInit(): void {
    this.form = this.passportIssuerFormBuilder.buildForm(this.passportIssuer);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
    this.clientCredentialsSet = !!this.passportIssuer?.dto?.clientId;

    this.translators$ = this.passportTranslators.get();
    this.passportIssuers$ = this.passportIssuersStore.getAsList(pick('dto.issuer'));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getModel(): EntityModel {
    const { id, clientSecret, ...rest } = this.form.value;
    const issuer: TrustedIssuer = TrustedIssuer.create({
      ...rest,
    });

    return new EntityModel(id, issuer);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  validateClientCredentials(): void {
    const clientId: string = this.form.get('clientId').value;
    const clientSecret: string = this.form.get('clientSecret').value;

    const clientIdInputIsEmpty = !clientId || !clientId.trim();
    const clientSecretInputIsEmpty = !clientSecret || !clientSecret.trim();

    if (this.clientCredentialsSet && clientIdInputIsEmpty) {
      this.form.get('clientId').setErrors({ empty: true });
    }
    if (!this.clientCredentialsSet && !clientIdInputIsEmpty && clientSecretInputIsEmpty) {
      this.form.get('clientSecret').setErrors({ empty: true });
    }
    if (!this.clientCredentialsSet && clientIdInputIsEmpty) {
      this.form.get('clientSecret').reset();
    }
  }

}
