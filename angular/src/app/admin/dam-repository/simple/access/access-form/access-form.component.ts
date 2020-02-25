import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { alignControlsWithModelDefinitions, EntityModel, Form, isExpanded, removeInternalFields } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { dam } from '../../../../../shared/proto/dam-service';
import { ServiceDefinitionService } from '../../../advanced/service-definitions/service-definitions.service';
import { TargetAdapterVariables } from '../../../advanced/target-adapters/target-adapter-variables.model';
import { ConditionFormComponent } from '../../../shared/condition-form/condition-form.component';

import { AccessFormBuilder } from './access-form-builder.service';

import Policy = dam.v1.Policy;

@Component({
  selector: 'ddap-access-form',
  templateUrl: './access-form.component.html',
  styleUrls: ['./access-form.component.scss'],
})
export class AccessFormComponent implements OnInit, Form {

  @Input()
  serviceTemplate: string;

  accessLevelRadio: FormControl = new FormControl('READ');
  accessPolicyRadio: FormControl = new FormControl('CONTROL_ACCESS_GRANT');

  form: FormGroup;
  isExpanded: Function = isExpanded;
  variables: TargetAdapterVariables;


  constructor(private accessFormBuilder: AccessFormBuilder,
              private serviceDefinitionService: ServiceDefinitionService) {
  }

  ngOnInit(): void {
    this.serviceDefinitionService.getTargetAdapterVariables(this.serviceTemplate)
      .subscribe((variables) => {
        this.variables = variables;
        this.form = this.accessFormBuilder.buildForm(variables);
      });
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }



}
