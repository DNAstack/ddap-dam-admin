import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';

import { ServiceDefinitionService } from '../../../advanced/service-definitions/service-definitions.service';
import { TargetAdapterVariables } from '../../../advanced/target-adapters/target-adapter-variables.model';
import { AccessLevel } from '../../shared/access-level.enum';
import { AccessPolicyType } from '../../shared/access-policy-type.enum';

import { AccessFormBuilder } from './access-form-builder.service';

@Component({
  selector: 'ddap-access-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.scss'],
})
export class AccessFormComponent implements OnInit, Form {

  @Input()
  serviceTemplate: string;

  accessLevelRadio: FormControl = new FormControl(AccessLevel.read);
  accessPolicyRadio: FormControl = new FormControl(AccessPolicyType.controlAccessGrants);

  form: FormGroup;
  isExpanded: Function = isExpanded;
  variables: TargetAdapterVariables;

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
