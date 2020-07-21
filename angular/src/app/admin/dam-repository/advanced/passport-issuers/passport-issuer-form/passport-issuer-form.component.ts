import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel, Form, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable, Subscription } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import { pick } from '../../../shared/autocomplete.util';
import TrustedIssuer = dam.v1.TrustedIssuer;
import { generateInternalName } from '../../../shared/internal-name.util';
import { PassportTranslatorsService } from '../../passport-translators/passport-translators.service';
import { PassportIssuersStore } from '../passport-issuers.store';

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

  constructor(private formBuilder: FormBuilder,
              private passportTranslators: PassportTranslatorsService,
              private passportIssuersStore: PassportIssuersStore) {

  }

  ngOnInit(): void {
    const { ui, issuer, translateUsing } = _get(this.passportIssuer, 'dto', {});

    this.translators$ = this.passportTranslators.get();

    // TODO: move to passport-issuer-form-builder.service.ts
    this.form = this.formBuilder.group({
      id: [this.passportIssuer.name || '', [Validators.required, Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(ui, 'label', ''), []],
        description: [_get(ui, 'description', ''), [Validators.required, Validators.maxLength(255)]],
      }),
      issuer: [issuer, Validators.required],
      translateUsing: [translateUsing],
      clientId: [this.passportIssuer.dto ? this.passportIssuer.dto.clientId : ''],
      tokenUrl: [this.passportIssuer.dto ? this.passportIssuer.dto.tokenUrl : ''],
      authUrl: [this.passportIssuer.dto ? this.passportIssuer.dto.authUrl : ''],
    });
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }

    this.passportIssuers$ = this.passportIssuersStore.getAsList(pick('dto.issuer'));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getModel(): EntityModel {
    const {id, ui, issuer, translateUsing, authUrl, tokenUrl, clientId} = this.form.value;
    const clientApplication: TrustedIssuer = TrustedIssuer.create({
      ui,
      issuer,
      translateUsing,
      authUrl,
      tokenUrl,
      clientId,
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
