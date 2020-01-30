import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityModel, FormValidators, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../shared/proto/dam-service';
import IVariableFormat = dam.v1.IVariableFormat;
import { ConditionAutocompleteService } from '../../shared/condition-form/condition-autocomplete.service';
import { ConditionFormBuilder } from '../../shared/condition-form/condition-form-builder.service';

@Injectable({
  providedIn: 'root',
})
export class ClientApplicationFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(clientApp?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(clientApp, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(clientApp, 'dto.ui.label'), [Validators.required]],
        description: [_get(clientApp, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      clientId: [_get(clientApp, 'dto.clientId'), []],
      scope: [_get(clientApp, 'dto.scope'), [Validators.required]],
      grantTypes: this.buildArrayForm(_get(clientApp, 'dto.grantTypes'), []),
      responseTypes: this.buildArrayForm(_get(clientApp, 'dto.responseTypes'), []),
      redirectUris: this.buildArrayForm(_get(clientApp, 'dto.redirectUris'), [FormValidators.url]),
    });
  }

  buildArrayForm(array?: string[], validators?: any[]): FormArray {
    return this.formBuilder.array(array
                                  ? array.map((value) => this.buildStringControl(value, validators))
                                  : []);
  }

  buildStringControl(value?: string, validators?: any[]): FormControl {
    return this.formBuilder.control(value, [...validators]);
  }

}


