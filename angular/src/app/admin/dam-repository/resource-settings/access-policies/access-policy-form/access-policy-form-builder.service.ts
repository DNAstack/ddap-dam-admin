import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../../shared/proto/dam-service';
import IVariableFormat = dam.v1.IVariableFormat;
import { ConditionAutocompleteService } from '../../../shared/condition-form/condition-autocomplete.service';
import { ConditionFormBuilder } from '../../../shared/condition-form/condition-form-builder.service';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyFormBuilder extends ConditionFormBuilder {

  constructor(protected formBuilder: FormBuilder,
              protected autocompleteService: ConditionAutocompleteService) {
    super(formBuilder, autocompleteService);
  }

  buildForm(policy?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(policy, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(policy, 'dto.ui.label'), [Validators.required]],
        description: [_get(policy, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
        infoUrl: [_get(policy, 'dto.ui.infoUrl'), []],
      }),
      anyOf: this.buildConditionsForm(_get(policy, 'dto.anyOf')),
      variableDefinitions: this.buildVariableDefinitionsForm(_get(policy, 'dto.variableDefinitions')),
    });
  }

  buildVariableDefinitionsForm(variableDefinitions?: { [key: string]: IVariableFormat }): FormGroup {
    const variableDefinitionsForm = {};
    if (variableDefinitions) {
      Object.entries(variableDefinitions)
        .forEach(([variableKey, variableFormat]) => {
          variableDefinitionsForm[variableKey] = this.buildVariableDefinitionForm(variableKey, variableFormat);
        });
    }
    return this.formBuilder.group(variableDefinitionsForm);
  }

  buildVariableDefinitionForm(variableId?: string, variableFormat?: IVariableFormat): FormGroup {
    return this.formBuilder.group({
      id: [variableId, [Validators.required]],
      regexp: [_get(variableFormat, 'regexp'), [Validators.required]],
      ui: this.formBuilder.group({
        description: [_get(variableFormat, 'ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
    });
  }

}


