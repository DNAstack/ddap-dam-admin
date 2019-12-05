import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { PassportVisaValidators } from '../passport-visa/passport-visa-validators';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;
import ConditionPrefix = PassportVisa.ConditionPrefix;

export abstract class ConditionFormBuilder {

  prefixes: string[] = Object.values(ConditionPrefix);

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
      prefix: [this.extractPrefix(jointValue)],
      value: [this.extractValue(jointValue)],
    });
  }

  private extractPrefix(jointValue: string): string {
    let usedPrefix;
    if (jointValue) {
      usedPrefix = this.prefixes.find((prefix) => {
        return jointValue.startsWith(`${prefix}:`);
      });
    }
    return usedPrefix ? usedPrefix : '';
  }
  private extractValue(jointValue: string): any {
    const usedPrefix = this.extractPrefix(jointValue);
    return usedPrefix && usedPrefix !== ''
      ? jointValue.replace(`${usedPrefix}:`, '').split(';')
      : jointValue;
  }
}


