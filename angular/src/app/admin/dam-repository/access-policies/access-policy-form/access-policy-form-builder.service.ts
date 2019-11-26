import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { ConditionFormBuilder } from '../../shared/condition-form/condition-form-builder.service';
import { PassportVisaValidators } from '../../shared/passport-visa/passport-visa-validators';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyFormBuilder extends ConditionFormBuilder {

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  buildForm(policy?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(policy, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(policy, 'dto.ui.label'), [Validators.required]],
        description: [_get(policy, 'dto.ui.description'), [Validators.required]],
        infoUrl: [_get(policy, 'dto.ui.infoUrl'), []],
      }),
      anyOf: this.buildConditionsForm(_get(policy, 'dto.anyOf')),
    });
  }

}


