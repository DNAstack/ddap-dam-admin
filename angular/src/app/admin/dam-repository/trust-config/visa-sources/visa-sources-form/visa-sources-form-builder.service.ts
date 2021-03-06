import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class VisaSourcesFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(trustedSource?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(trustedSource, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(trustedSource, 'dto.ui.label'), [Validators.required]],
        description: [_get(trustedSource, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      sources: this.buildArrayForm(_get(trustedSource, 'dto.sources')),
      visaTypes: this.buildArrayForm(_get(trustedSource, 'dto.visaTypes')),
    });
  }

  buildArrayForm(array?: string[]): FormArray {
    return this.formBuilder.array(array
                                  ? array.map((value) => this.buildStringControl(value))
                                  : []);
  }

  buildStringControl(value?: string): FormControl {
    return this.formBuilder.control(value, [Validators.required]);
  }

}


