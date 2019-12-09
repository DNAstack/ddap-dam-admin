import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';

import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;
import { PrefixValuePairService } from './prefix-value-pair.service';

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
            source: this.buildPrefixValuePairForm(conditionClause.source),
            value: this.buildPrefixValuePairForm(conditionClause.value),
            by: this.buildPrefixValuePairForm(conditionClause.by),
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
      source: this.buildPrefixValuePairForm(_get(clause, 'source')),
      value: this.buildPrefixValuePairForm(_get(clause, 'value')),
      by: this.buildPrefixValuePairForm(_get(clause, 'by')),
    });
  }

  private buildPrefixValuePairForm(jointValue: string): FormGroup {
    return this.formBuilder.group({
      prefix: [PrefixValuePairService.extractPrefix(jointValue)],
      value: [PrefixValuePairService.extractValue(jointValue)],
    });
  }

}


