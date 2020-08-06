import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'ddap-common-lib';
import { Form } from 'ddap-common-lib';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';
import VisaType = dam.v1.VisaType;
import { Subscription } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import { generateInternalName } from '../../../shared/internal-name.util';

@Component({
  selector: 'ddap-visa-type-form',
  templateUrl: './visa-type-form.component.html',
  styleUrls: ['./visa-type-form.component.scss'],

})
export class VisaTypeFormComponent implements OnInit, OnDestroy, Form {

  @Input()
  internalNameEditable = false;
  @Input()
  claimDefinition?: EntityModel = new EntityModel('', VisaType.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const { ui } = _get(this.claimDefinition, 'dto', {});

    // TODO: move this to claim-definition-form-builder.service
    this.form = this.formBuilder.group({
      id: [this.claimDefinition.name || '', [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [ui.label || '', [Validators.required]],
        description: [ui.description || '', [Validators.required, Validators.maxLength(255)]],
        infoUrl: [ui.infoUrl || '', [FormValidators.url]],
      }),
    });
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

  getModel(): EntityModel {
    const { id, ui } = this.form.value;
    const visaType: VisaType = VisaType.create({
      ui,
    });

    return new EntityModel(id, visaType);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

}
