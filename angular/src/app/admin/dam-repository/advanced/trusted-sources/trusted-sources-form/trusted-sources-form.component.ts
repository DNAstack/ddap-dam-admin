import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { EntityModel, Form, isExpanded } from 'ddap-common-lib';
import { Subscription } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import TrustedSource = dam.v1.TrustedSource;
import { generateInternalName } from '../../../shared/internal-name.util';

import { TrustedSourcesFormBuilder } from './trusted-sources-form-builder.service';

@Component({
  selector: 'ddap-trusted-sources-form',
  templateUrl: './trusted-sources-form.component.html',
  styleUrls: ['./trusted-sources-form.component.scss'],
})
export class TrustedSourcesFormComponent implements OnInit, OnDestroy, Form {

  get sources() {
    return this.form.get('sources') as FormArray;
  }

  get visaTypes() {
    return this.form.get('visaTypes') as FormArray;
  }

  @Input()
  internalNameEditable = false;
  @Input()
  trustedSource?: EntityModel = new EntityModel('', TrustedSource.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  isExpanded: Function = isExpanded;

  constructor(private trustedSourcesFormBuilder: TrustedSourcesFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.trustedSourcesFormBuilder.buildForm(this.trustedSource);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  addSource(): void {
    const firstControl = this.getFirstControl(this.sources);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.sources.insert(0, this.trustedSourcesFormBuilder.buildStringControl());
  }

  addVisaType(): void {
    const firstControl = this.getFirstControl(this.visaTypes);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.visaTypes.insert(0, this.trustedSourcesFormBuilder.buildStringControl());
  }

  getModel(): EntityModel {
    const {id, sources, visaTypes, ui} = this.form.value;
    const trustedSources = TrustedSource.create({
      visaTypes,
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
