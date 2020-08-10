import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { scim } from '../../../../shared/proto/dam-service';
import IGroup = scim.v2.IGroup;
import IMember = scim.v2.IMember;


@Injectable({
  providedIn: 'root',
})
export class GroupFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(group?: IGroup): FormGroup {
    return this.formBuilder.group({
      id: [_get(group, 'id'), [Validators.pattern(nameConstraintPattern)]],
      displayName: [_get(group, 'displayName'), [Validators.required]],
      members: this.buildMembersForm(_get(group, 'members'), []),
    });
  }

  buildMembersForm(members?: IMember[], validators?: any[]): FormArray {
    return this.formBuilder.array(members
                                  ? members.map((member: IMember) => this.buildStringControl(member.value, validators))
                                  : []);
  }

  buildStringControl(value?: string, validators?: any[]): FormControl {
    return this.formBuilder.control(value, [...validators]);
  }

}


