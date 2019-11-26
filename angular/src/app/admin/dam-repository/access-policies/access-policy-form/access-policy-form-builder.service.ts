import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { PassportVisaValidators } from '../../shared/passport-visa/passport-visa-validators';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyFormBuilder {

  constructor(private formBuilder: FormBuilder) {
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

  buildConditionsForm(conditions?: ICondition[]): FormArray {
    return this.formBuilder.array(conditions ? conditions.map((condition) => {
      return this.formBuilder.group({
        allOf: this.formBuilder.array(condition.allOf.map((conditionClause: IConditionClause) => {
          return this.formBuilder.group({
            type: [conditionClause.type, [Validators.required]],
            source: [conditionClause.source, [PassportVisaValidators.hasPrefix]],
            value: [conditionClause.value, [PassportVisaValidators.hasPrefix]],
            by: [conditionClause.by, [PassportVisaValidators.hasPrefix]],
          });
        })),
      });
    }) : []);
  }

  buildConditionForm(): FormGroup {
    return this.formBuilder.group({
      allOf: this.formBuilder.array([this.buildClauseConditionForm()]),
    });
  }

  buildClauseConditionForm(clause?: IConditionClause): FormGroup {
    return this.formBuilder.group({
      type: [_get(clause, 'type'), [Validators.required]],
      source: [_get(clause, 'source')],
      value: [_get(clause, 'value')],
      by: [_get(clause, 'by')],
    });
  }

}


