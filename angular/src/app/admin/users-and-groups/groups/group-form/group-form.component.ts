import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';
import { Subscription } from 'rxjs';

import { scim } from '../../../../shared/proto/dam-service';
import { generateInternalName } from '../../../dam-repository/shared/internal-name.util';

import { GroupFormBuilder } from './group-form-builder.service';
import IGroup = scim.v2.IGroup;
import IMember = scim.v2.IMember;

@Component({
  selector: 'ddap-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
})
export class GroupFormComponent implements OnInit, OnDestroy, Form {

  @Input()
  group?: IGroup;
  @Input()
  internalNameEditable = false;
  @Input()
  editable = true;

  form: FormGroup;
  isExpanded: Function = isExpanded;
  subscriptions: Subscription[] = [];

  constructor(private groupFormBuilder: GroupFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.groupFormBuilder.buildForm(this.group);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('displayName').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getModel(): IGroup {
    const { members, ...rest } = this.form.value;
    return {
      ...rest,
      members: this.getMembersModel(members),
    };
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  private getMembersModel(emails: string[]): IMember[] {
    return emails
      .filter((email) => email && email.length > 0)
      .map((email) => {
      return {
        type: 'User',
        value: email,
      };
    });
  }

}
