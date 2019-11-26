import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { PassportVisaValidators } from '../passport-visa/passport-visa-validators';

export abstract class ConditionFormBuilder {

  constructor(protected formBuilder: FormBuilder) {
  }

  abstract buildForm(entity?: EntityModel): FormGroup;

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


