import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';

import { ConditionAutocompleteService } from './condition-autocomplete.service';
import { PrefixValuePairService } from './prefix-value-pair.service';

import ICondition = common.ConditionSet;
import IConditionClause = common.Condition;

export abstract class ConditionFormBuilder {
  constructor(protected formBuilder: FormBuilder,
              protected autocompleteService: ConditionAutocompleteService) {
  }

  abstract buildForm(entity?: EntityModel): FormGroup;

  buildConditionsForm(conditions?: ICondition[]): FormArray {
    return this.formBuilder.array(conditions ? conditions.map((condition) => {
      return this.buildConditionForm(condition);
    }) : []);
  }

  buildConditionForm(condition?: ICondition): FormGroup {
    return this.formBuilder.group({
      allOf: this.formBuilder.array(condition ? condition.allOf.map((conditionClause: IConditionClause) => {
        return this.buildClauseConditionForm(conditionClause);
      }) : [this.buildClauseConditionForm()]),
    });
  }

  buildClauseConditionForm(clause?: IConditionClause): FormGroup {
    const form: FormGroup = this.formBuilder.group({
      type: [_get(clause, 'type'), [Validators.required]],
      source: this.buildPrefixValuePairForm(_get(clause, 'source')),
      value: this.buildPrefixValuePairForm(_get(clause, 'value')),
      by: this.buildPrefixValuePairForm(_get(clause, 'by')),
      _autocomplete_values_for_type: [],
    });
    this.buildAutocompleteForValueField(form);
    if (clause) {
      this.setAutocompleteValuesForType(form, _get(clause, 'type'));
    }

    return form;
  }

  private buildPrefixValuePairForm(jointValue: string): FormGroup {
    return this.formBuilder.group({
      prefix: [PrefixValuePairService.extractPrefix(jointValue)],
      value: [PrefixValuePairService.extractValue(jointValue)],
    });
  }

  private buildAutocompleteForValueField(form: FormGroup) {
    form.get('type').valueChanges
      .subscribe((type) => {
        form.get('value').reset();
        this.setAutocompleteValuesForType(form, type);
      });
  }

  private setAutocompleteValuesForType(form: FormGroup, type: string) {
    this.autocompleteService.getValuesForType(type)
      .subscribe((values) => {
        this.autocompleteService.setAutocompleteValuesForType(values);
        form.get('_autocomplete_values_for_type').setValue(values);
      });
  }

}


