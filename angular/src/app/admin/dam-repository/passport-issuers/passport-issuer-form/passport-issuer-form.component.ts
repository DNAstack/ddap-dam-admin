import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'ddap-common-lib';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable } from 'rxjs';

import { dam } from '../../../../shared/proto/dam-service';
import TrustedPassportIssuer = dam.v1.TrustedPassportIssuer;
import { PassportTranslatorsService } from '../../passport-translators/passport-translators.service';
import { pick } from '../../shared/autocomplete.util';
import { PassportIssuersStore } from '../passport-issuers.store';

@Component({
  selector: 'ddap-passport-issuer-form',
  templateUrl: './passport-issuer-form.component.html',
  styleUrls: ['./passport-issuer-form.component.scss'],

})
export class PassportIssuerFormComponent implements OnInit, Form {

  @Input()
  passportIssuer?: EntityModel = new EntityModel('', TrustedPassportIssuer.create());

  form: FormGroup;

  passportIssuers$: Observable<any>;
  translators$: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              private passportTranslators: PassportTranslatorsService,
              private passportIssuersStore: PassportIssuersStore) {

  }

  ngOnInit(): void {
    const { ui, issuer, translateUsing } = _get(this.passportIssuer, 'dto', {});

    this.translators$ = this.passportTranslators.get();

    this.form = this.formBuilder.group({
      id: [this.passportIssuer.name || '', [Validators.required, Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(ui, 'label', ''), []],
        description: [_get(ui, 'description', ''), [Validators.required, Validators.maxLength(255)]],
      }),
      issuer: [issuer, Validators.required],
      translateUsing: [translateUsing],
    });

    this.passportIssuers$ = this.passportIssuersStore.getAsList(pick('dto.issuer'));
  }

  getModel(): EntityModel {
    const {id, ui, issuer, translateUsing} = this.form.value;
    const clientApplication: TrustedPassportIssuer = TrustedPassportIssuer.create({
      ui,
      issuer,
      translateUsing,
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
