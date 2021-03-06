import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators, nameConstraintPattern } from 'ddap-common-lib';

import { TargetAdapterVariables } from '../../../advanced-settings/target-adapters/target-adapter-variables.model';

@Injectable({
  providedIn: 'root',
})
export class AccessFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(variables: TargetAdapterVariables): FormGroup {
    return this.formBuilder.group({
      displayName: ['', [Validators.required]],
      variables: this.buildVariablesForm(variables),
      accessPolicyValue: ['', [Validators.required, FormValidators.url]],
    });
  }

  buildVariablesForm(variables: TargetAdapterVariables): FormGroup {
    const variablesGroup = {};
    Object.entries(variables).forEach(([key, value]) => {
      variablesGroup[key] = ['', !value.optional ? [Validators.required] : []];
    });
    return this.formBuilder.group(variablesGroup);
  }

}


