import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { common } from '../../../../shared/proto/dam-service';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

import { ConditionAutocompleteService } from './condition-autocomplete.service';
import { ConditionFormBuilder } from './condition-form-builder.service';
import ConditionPrefix = PassportVisa.ConditionPrefix;
import IConditionSet = common.IConditionSet;
import ICondition = common.ICondition;

@Component({
  selector: 'ddap-condition-form',
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.scss'],
})
export class ConditionFormComponent implements OnInit {

  @Input()
  entity: EntityModel;
  @Input()
  form: FormGroup;
  @Input()
  conditionFormBuilder: ConditionFormBuilder;
  @Input()
  anyOfFieldName: string;
  @Input()
  label?: string;

  trustedSources: string[];
  prefixes: string[] = Object.values(ConditionPrefix);

  get conditions() {
    return this.form.get(this.anyOfFieldName) as FormArray;
  }

  constructor(public autocompleteService: ConditionAutocompleteService) {
  }

  ngOnInit(): void {
    this.autocompleteService.getSourceValues()
      .subscribe((sources) => {
        this.trustedSources = sources;
      });
  }

  getModel(): IConditionSet[] {
    const anyOf: any[] = this.form.get(this.anyOfFieldName).value;
    const anyOfModel: IConditionSet[] = [];

    anyOf.forEach((condition) => {
      const allOfModel: ICondition[] = [];
      condition.allOf.forEach((clause) => {
        const clauseModel = { type: clause.type };
        const hasValueSet = (field) => !!_get(clause, `${field}.value`);
        ['by', 'source', 'value']
          .filter(hasValueSet)
          .forEach((field) => {
            clauseModel[field] = `${clause[field].prefix}:${clause[field].value}`;
          });
        allOfModel.push(clauseModel);
      });
      anyOfModel.push({ allOf: allOfModel });
    });

    return anyOfModel;
  }

  getClauses(condition: AbstractControl) {
    return condition.get('allOf') as FormArray;
  }

  addCondition() {
    this.conditions.insert(0, this.conditionFormBuilder.buildConditionForm());
  }

  removeCondition(index: number) {
    this.conditions.removeAt(index);
  }

  addClauseCondition(condition: AbstractControl) {
    this.getClauses(condition).push(this.conditionFormBuilder.buildClauseConditionForm());
  }

  removeClauseCondition(condition: AbstractControl, clauseIndex: number, conditionIndex: number) {
    this.getClauses(condition).removeAt(clauseIndex);
    if (this.getClauses(condition).length < 1) {
      this.removeCondition(conditionIndex);
    }
  }

  isSplitPattern = (prefix: string): boolean => prefix === ConditionPrefix.split_pattern;

  showAutocompleteDropdown(prefix: string, control: AbstractControl): boolean {
    if (prefix === ConditionPrefix.const || prefix === ConditionPrefix.pattern) {
      const { value } = control;
      return !value || value.length < 1;
    }
    return this.isSplitPattern(prefix);
  }

}
