import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { EntityModel } from 'ddap-common-lib';

import { dam } from '../../../../shared/proto/dam-service';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

import { ConditionAutocompleteService } from './condition-autocomplete.service';
import { ConditionFormBuilder } from './condition-form-builder.service';
import ConditionPrefix = PassportVisa.ConditionPrefix;


import Policy = dam.v1.Policy;

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

  getModel(): EntityModel {
    const { id, ui, anyOf } = this.form.value;
    const accessPolicy: Policy = Policy.create({
      ui,
      anyOf,
    });

    return new EntityModel(id, accessPolicy);
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
      return !value || value === '';
    }
    return this.isSplitPattern(prefix);
  }

}
