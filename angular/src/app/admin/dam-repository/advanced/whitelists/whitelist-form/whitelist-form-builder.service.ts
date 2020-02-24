import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';


@Injectable({
  providedIn: 'root',
})
export class WhitelistFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(whitelist?: EntityModel): FormGroup {
    return this.formBuilder.group({
      name: [_get(whitelist, 'name'), [Validators.pattern(nameConstraintPattern)]],
      users: this.buildUsersForm(_get(whitelist, 'users'), []),
    });
  }

  buildUsersForm(users?: string[], validators?: any[]): FormArray {
    return this.formBuilder.array(users
                                  ? users.map((value) => this.buildUserForm(value, validators))
                                  : []);
  }

  buildUserForm(user?: any, validators?: any[]): FormGroup {
    return this.formBuilder.group({
      email: [_get(user, 'email'), [...validators]],
    });
  }

}


