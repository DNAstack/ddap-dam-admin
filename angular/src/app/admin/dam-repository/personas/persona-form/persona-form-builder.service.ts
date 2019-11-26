import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'ddap-common-lib';
import IAssertion = common.IAssertion;
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { ConditionFormBuilder } from '../../shared/condition-form/condition-form-builder.service';

@Injectable({
  providedIn: 'root',
})
export class PersonaFormBuilder extends ConditionFormBuilder {

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  buildForm(persona?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(persona, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(persona, 'dto.ui.label'), [Validators.required]],
      }),
      passport: this.formBuilder.group({
        standardClaims: this.formBuilder.group({
          iss: [_get(persona, 'dto.passport.standardClaims.iss'), Validators.required],
          email: [_get(persona, 'dto.passport.standardClaims.email'), Validators.required],
          picture: [_get(persona, 'dto.passport.standardClaims.picture'), FormValidators.url],
        }),
        ga4ghAssertions: this.buildGa4ghAssertionsForm(_get(persona, 'dto.passport.ga4ghAssertions')),
      }),
    });
  }

  buildGa4ghAssertionsForm(ga4ghAssertions?: IAssertion[]): FormArray {
    return this.formBuilder.array(ga4ghAssertions
      ? ga4ghAssertions.map((assertion: common.IAssertion) => this.buildGa4ghAssertionForm(assertion))
      : []
    );
  }

  buildGa4ghAssertionForm(ga4fhAssertion?: IAssertion): FormGroup {
    return this.formBuilder.group({
      type: [_get(ga4fhAssertion, 'type'), [Validators.required]],
      source: [_get(ga4fhAssertion, 'source'), [Validators.required, FormValidators.url]],
      value: [_get(ga4fhAssertion, 'value'), [Validators.required]],
      assertedDuration: [_get(ga4fhAssertion, 'assertedDuration'), [Validators.required, FormValidators.duration]],
      expiresDuration: [_get(ga4fhAssertion, 'expiresDuration'), [Validators.required, FormValidators.duration]],
      by: [_get(ga4fhAssertion, 'by')],
      anyOfConditions: this.buildConditionsForm(_get(ga4fhAssertion, 'anyOfConditions')),
    });
  }

}


