import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';

import { GroupFormBuilder } from './group-form-builder.service';

@Component({
  selector: 'ddap-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
})
export class GroupFormComponent implements OnInit, Form {

  get users() {
    return this.form.get('users') as FormArray;
  }

  @Input()
  whitelist?: any;
  @Input()
  editable = true;

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private whitelistFormBuilder: GroupFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.whitelistFormBuilder.buildForm(this.whitelist);
  }

  addUser(): void {
    this.users.insert(0, this.whitelistFormBuilder.buildUserForm(null, [Validators.required]));
  }

  removeUser(index: number): void {
    this.users.removeAt(index);
  }

  getModel(): any {
    return this.form.value;
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

}
