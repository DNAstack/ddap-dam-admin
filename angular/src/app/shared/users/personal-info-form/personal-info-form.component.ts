import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';

import { scim } from '../../proto/dam-service';
import { ScimService } from '../scim.service';
import { UserService } from '../user.service';

import { PersonalInfoFormBuilder } from './personal-info-form-builder.service';
import IPatch = scim.v2.IPatch;

@Component({
  selector: 'ddap-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
})
export class PersonalInfoFormComponent implements Form, OnInit {

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  get photos() {
    return this.form.get('photos') as FormArray;
  }

  @Input()
  user?: any;
  @Input()
  adminMode: boolean;

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private personalInfoFormBuilder: PersonalInfoFormBuilder,
              private userService: UserService) {
  }

  ngOnInit() {
    this.form = this.personalInfoFormBuilder.buildForm(this.adminMode, this.user);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  unlinkAccount(email: AbstractControl) {
    const ref = email.get('$ref').value;
    this.userService.patchUser(this.user.id, ScimService.getAccountUnlinkPatch(ref))
      .subscribe(() => window.location.reload());
  }

  makeAttributePrimary(controls: AbstractControl[], controlToBePrimary: AbstractControl): void {
    const unsetAllAttributesAsPrimary = () => {
      controls.forEach((control) => {
        control.get('primary').setValue(false);
      });
    };

    unsetAllAttributesAsPrimary();
    controlToBePrimary.get('primary').setValue(true);
  }

  getModel(): IPatch {
    return  ScimService.getOperationsPatch(this.user, this.form.getRawValue());
  }

}
