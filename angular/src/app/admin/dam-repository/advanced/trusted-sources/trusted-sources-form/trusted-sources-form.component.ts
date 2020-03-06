import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import TrustedSource = dam.v1.TrustedSource;
import { Form, isExpanded } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';

import { dam } from '../../../../../shared/proto/dam-service';

import { TrustedSourcesFormBuilder } from './trusted-sources-form-builder.service';

@Component({
  selector: 'ddap-trusted-sources-form',
  templateUrl: './trusted-sources-form.component.html',
  styleUrls: ['./trusted-sources-form.component.scss'],
})
export class TrustedSourcesFormComponent implements OnInit, Form {

  get sources() {
    return this.form.get('sources') as FormArray;
  }

  get claims() {
    return this.form.get('claims') as FormArray;
  }

  @Input()
  trustedSource?: EntityModel = new EntityModel('', TrustedSource.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private trustedSourcesFormBuilder: TrustedSourcesFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.trustedSourcesFormBuilder.buildForm(this.trustedSource);
  }

  addSource(): void {
    const firstControl = this.getFirstControl(this.sources);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.sources.insert(0, this.trustedSourcesFormBuilder.buildStringControl());
  }

  addClaim(): void {
    const firstControl = this.getFirstControl(this.claims);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.claims.insert(0, this.trustedSourcesFormBuilder.buildStringControl());
  }

  getModel(): EntityModel {
    const {id, sources, claims, ui} = this.form.value;
    const trustedSources = TrustedSource.create({
      claims,
      sources,
      ui,
    });

    return new EntityModel(id, trustedSources);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  private getFirstControl(formControls: FormArray): AbstractControl {
    return formControls.at(0);
  }

}
