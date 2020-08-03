import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { EntityModel, isExpanded } from 'ddap-common-lib';
import _get from 'lodash.get';
import ConditionPrefix = PassportVisa.ConditionPrefix;
import IConditionSet = common.IConditionSet;
import ICondition = common.ICondition;
import { TagModelClass } from 'ngx-chips/core/accessor';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { common } from '../../../../shared/proto/dam-service';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

import { ConditionAutocompleteService } from './condition-autocomplete.service';
import { ConditionFormBuilder } from './condition-form-builder.service';
import AuthorityLevel = PassportVisa.AuthorityLevel;

@Component({
  selector: 'ddap-condition-form',
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.scss'],
})
export class ConditionFormComponent implements OnInit {

  get conditions() {
    return this.form.get(this.anyOfFieldName) as FormArray;
  }

  @Input()
  entity: EntityModel;
  @Input()
  form: FormGroup;
  @Input()
  conditionFormBuilder: ConditionFormBuilder;
  @Input()
  anyOfFieldName: string;
  @Input()
  labels: {
    header: string;
    description: string;
  };
  @Input()
  showTrustedSources = false;
  @Input()
  showVariables = false;
  @Input()
  variableDefinitions;
  @Input()
  warnOnInvalidValuesForByInput = true;

  isExpanded: Function = isExpanded;
  trustedSources: any;
  trustedSourcesValues: string[];
  prefixes: string[] = Object.values(ConditionPrefix);
  autocompleteValuesForType: any;
  validators = [this.doesNotContainReservedSymbol];
  errorMessages = {
    'containsReservedSymbol': 'Semi-colons (“;”) are not allowed in patterns',
  };

  constructor(public autocompleteService: ConditionAutocompleteService) {
  }

  ngOnInit(): void {
    if (this.showTrustedSources) {
      this.autocompleteService.getSourceNameValues()
        .subscribe((sources) => {
          this.trustedSourcesValues = sources.trustedSourcesValues;
          this.trustedSources = sources.trustedSources;
        });
    } else {
      this.autocompleteService.getSourceValues()
        .subscribe((sources) => {
          this.trustedSourcesValues = sources;
        });
    }
    if (this.showVariables) {
      this.subscribeToAutocompleteValuesForType();
    }
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
            const values: string[] = clause[field].value;
            clauseModel[field] = `${clause[field].prefix}:${values.join(';')}`;
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

  addBy(source, formGroup) {
    formGroup.get('by.prefix').patchValue('split_pattern');
  }

  addSource(source, formGroup) {
    formGroup.get('source.prefix').patchValue('split_pattern');
  }

  addValue(clauseValue: any | TagModelClass, formGroup: AbstractControl) {
    formGroup.get('value.prefix').patchValue('split_pattern');
  }

  resolveTrustedSource(source) {
    return (this.trustedSources && this.trustedSources[source]) ? this.trustedSources[source].toString() : source;
  }

  isTrustedSource(sourceName) {
    return !!this.trustedSources[sourceName];
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

  onValueChange(val) {
    this.updateAutocompleteItems(val);
  }

  updateAutocompleteItems = (text: string): Observable<string[]> => {
    const items = [];
    const bSub = new BehaviorSubject<any>([]);
    if (this.variableNames() && this.variableNames().length > 0 && text.length > 0) {
      this.variableNames().forEach(variable => {
        items.push(`${text}\${${variable}}`);
      });
      bSub.next(this.autocompleteValuesForType.concat(items));
    } else {
      bSub.next(this.autocompleteValuesForType);
    }
    return bSub;
  }

  variableNames() {
    const {value} = this.variableDefinitions;
    return Object.entries(value)
      .map(([_, variableData]) => {
        return variableData ? variableData['id'] : '';
    });
  }

  getPanelTitle(numberOfConditions: number): string {
    return numberOfConditions > 1
      ? `Clause with ${numberOfConditions} Requirements`
      : `Clause with ${numberOfConditions} Requirement`;
  }

  isStandardByValue(by: string): boolean {
    if (!this.warnOnInvalidValuesForByInput) {
      return true;
    }
    const mayBeAuthorityLevel: AuthorityLevel | undefined = (<any>AuthorityLevel)[by];
    return mayBeAuthorityLevel !== undefined;
  }

  private subscribeToAutocompleteValuesForType() {
    this.autocompleteService.fetchAutocompleteValuesForType$.subscribe((values) => {
      this.autocompleteValuesForType = values;
    });
  }

  private doesNotContainReservedSymbol(control: FormControl) {
    if (control.value.includes(';')) {
      return {
        'containsReservedSymbol': true,
      };
    }

    return null;
  }

}
