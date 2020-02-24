import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class AccessFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(policy?: EntityModel): FormGroup {
    return this.formBuilder.group({
    });
  }

}


