import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';
import { Subscription } from 'rxjs';

import { scim } from '../../../../shared/proto/dam-service';
import { generateInternalName } from '../../../dam-repository/shared/internal-name.util';

import { GroupFormBuilder } from './group-form-builder.service';
import IGroup = scim.v2.IGroup;
import IMember = scim.v2.IMember;
import { MemberParseResultModel } from './member-parse-result.model';

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
  bulkEmailsControl: FormControl = new FormControl(undefined);

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

  parseToList() {
    const membersControl: FormArray = this.form.get('members') as FormArray;
    const inputValue: string | undefined = this.bulkEmailsControl.value?.trim();
    const parsedResult: MemberParseResultModel = GroupFormComponent.parseEmails(inputValue);
    parsedResult.parsedEmails.forEach((parsedEmail) => {
      // Do not add duplicate
      if (!membersControl.value.some((email) => email === parsedEmail)) {
        membersControl.push(this.groupFormBuilder.buildStringControl(parsedEmail, [Validators.required]));
      }
    });
  }

  static parseEmails(inputValue: string): MemberParseResultModel {
    const parsedEmails: string[] = [];

    if (!inputValue || inputValue.trim() === '') {
      return {
        parsedEmails,
      };
    }

    if (inputValue.includes(';') || inputValue.includes(',')) {
      inputValue.split(inputValue.includes(';') ? ';' : ',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .forEach((parsedEmail) => parsedEmails.push(parsedEmail));
    } else {
      parsedEmails.push(inputValue);
    }

    return {
      parsedEmails,
    };
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
