import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityModel, FormValidators, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../../shared/proto/dam-service';
import IVariableFormat = dam.v1.IVariableFormat;
import { ConditionAutocompleteService } from '../../../shared/condition-form/condition-autocomplete.service';
import { ConditionFormBuilder } from '../../../shared/condition-form/condition-form-builder.service';

@Injectable({
  providedIn: 'root',
})
export class PassportIssuerFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(passportIssuer?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(passportIssuer, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(passportIssuer, 'dto.ui.label'), [Validators.required]],
        description: [_get(passportIssuer, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      clientId: [_get(passportIssuer, 'dto.clientId'), []],
      clientSecret: [],
      issuer: [_get(passportIssuer, 'dto.issuer'), [Validators.required]],
      translateUsing: [_get(passportIssuer, 'dto.translateUsing'), []],
      tokenUrl: [_get(passportIssuer, 'dto.tokenUrl'), []],
      authUrl: [_get(passportIssuer, 'dto.authUrl'), [FormValidators.url]],
    });
  }

}


