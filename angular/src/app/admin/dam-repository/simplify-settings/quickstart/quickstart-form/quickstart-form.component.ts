import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';

import { ServiceDefinitionService } from '../../../advanced-settings/service-definitions/service-definitions.service';
import { TargetAdapterVariables } from '../../../advanced-settings/target-adapters/target-adapter-variables.model';
import { AccessLevel } from '../../shared/access-level.enum';
import { AccessPolicyType } from '../../shared/access-policy-type.enum';

import { AccessFormBuilder } from './quickstart-form-builder.service';

@Component({
  selector: 'ddap-quickstart-form',
  templateUrl: './quickstart-form.component.html',
  styleUrls: ['./quickstart-form.component.scss'],
})
export class QuickstartFormComponent implements OnInit, Form {

  @Input()
  serviceTemplate: string;

  readonly readonlyServiceTemplates = ['amazon-s3', 'redshift'];
  readonly accessLevelRadio: FormControl = new FormControl(AccessLevel.read);
  readonly accessPolicyRadio: FormControl = new FormControl(AccessPolicyType.controlAccessGrants);

  form: FormGroup;
  isExpanded: Function = isExpanded;
  variables: TargetAdapterVariables;
  helpDisplayed = false;

  constructor(private accessFormBuilder: AccessFormBuilder,
              private serviceDefinitionService: ServiceDefinitionService) {
  }

  ngOnInit(): void {
    this.serviceDefinitionService.getTargetAdapterVariables(this.serviceTemplate)
      .subscribe((variables) => {
        this.variables = this.getNonExperimentalVars(variables);
        this.form = this.accessFormBuilder.buildForm(this.variables);
      });
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getModel(): any {
    return this.form.value;
  }

  // FIXME DISCO-2745
  private getNonExperimentalVars(variables: TargetAdapterVariables) {
    const updatedVars = {};
    for (const[key, value] of Object.entries(variables)) {
      if (!value.experimental) {
        updatedVars[key] = value;
      }
    }
    return updatedVars;
  }
}
