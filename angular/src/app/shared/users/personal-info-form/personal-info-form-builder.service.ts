import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'ddap-common-lib';
import _get from 'lodash.get';

import { scim } from '../../proto/dam-service';

import IUser = scim.v2.IUser;
import IAttribute = scim.v2.IAttribute;

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(adminMode: boolean, user?: IUser): FormGroup {
    return this.formBuilder.group({
      displayName: [_get(user, 'displayName')],
      name: this.formBuilder.group({
        formatted: [_get(user, 'name.formatted')],
        familyName: [_get(user, 'name.familyName')],
        givenName: [_get(user, 'name.givenName')],
        middleName: [_get(user, 'name.middleName')],
      }),
      locale: [_get(user, 'locale')],
      preferredLanguage: [_get(user, 'preferredLanguage')],
      timezone: [_get(user, 'timezone')],
      active: new FormControl({ value: _get(user, 'active'), disabled: !adminMode }),
      emails: this.buildAttributeArrayForm(_get(user, 'emails'), [Validators.required]),
      photos: this.buildAttributeArrayForm(_get(user, 'photos'), [Validators.required, FormValidators.url]),
    });
  }

  buildAttributeArrayForm(attributes?: IAttribute[], validators?: any[]): FormArray {
    return this.formBuilder.array(attributes
                                  ? attributes.map((attribute: IAttribute) => this.buildAttributeForm(attribute, validators))
                                  : []
    );
  }

  buildAttributeForm(attribute?: IAttribute, validators?: any[]): FormGroup {
    return this.formBuilder.group({
      value: [_get(attribute, 'value'), [...validators]],
      primary: [_get(attribute, 'primary')],
      $ref: [_get(attribute, '$ref')],
    });
  }

}


