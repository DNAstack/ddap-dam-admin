import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import ConditionPrefix = PassportVisa.ConditionPrefix;
import AuthorityLevel = PassportVisa.AuthorityLevel;
import { EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { dam } from '../../../../shared/proto/dam-service';
import { ClaimDefinitionService } from '../../claim-definitions/claim-definitions.service';
import { ClaimDefinitionsStore } from '../../claim-definitions/claim-definitions.store';
import { PassportIssuersStore } from '../../passport-issuers/passport-issuers.store';
import { TrustedSourcesStore } from '../../trusted-sources/trusted-sources.store';
import { makeDistinct, pick } from '../autocomplete.util';
import { PassportVisa } from '../passport-visa/passport-visa.constant';

import { ConditionFormBuilder } from './condition-form-builder.service';
import { PrefixValuePairService } from './prefix-value-pair.service';

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

  passportVisaTypes$: Observable<string[]>;
  trustedSources: Observable<string[]>;
  passportIssuers: Observable<string[]>;
  authorityLevels: string[] = Object.values(AuthorityLevel);
  prefixes: string[] = Object.values(ConditionPrefix);

  get conditions() {
    return this.form.get(this.anyOfFieldName) as FormArray;
  }

  constructor(private claimDefinitionsStore: ClaimDefinitionsStore,
              private claimDefinitionService: ClaimDefinitionService,
              private trustedSourcesStore: TrustedSourcesStore,
              private passportIssuersStore: PassportIssuersStore) {
  }

  ngOnInit(): void {
    this.passportVisaTypes$ = this.claimDefinitionsStore.getAsList(pick('name'))
      .pipe(
        map(makeDistinct)
      );
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

  getPrefixBtnValue(control: AbstractControl): string {
    return control.value
           ? PrefixValuePairService.extractPrefix(control.value)
           : '';
  }

}
