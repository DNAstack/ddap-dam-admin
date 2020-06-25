import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormValidationService } from 'ddap-common-lib';
import { flatMap } from 'rxjs/operators';

import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessLevel } from '../../shared/access-level.enum';
import { AccessPolicyBuilderService } from '../../shared/access-policy-builder.service';
import { AccessPolicyType } from '../../shared/access-policy-type.enum';
import { ResourceBuilderService } from '../../shared/resource-builder.service';
import { QuickstartFormComponent } from '../quickstart-form/quickstart-form.component';

@Component({
  selector: 'ddap-quickstart-manage',
  templateUrl: './quickstart-manage.component.html',
  styleUrls: ['./quickstart-manage.component.scss'],
})
export class QuickstartManageComponent implements OnInit {

  @ViewChild(QuickstartFormComponent, { static: false })
  quickstartForm: QuickstartFormComponent;

  serviceTemplate: string;
  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private damConfigStore: DamConfigStore,
              private validationService: FormValidationService,
              private accessPolicyBuilderService: AccessPolicyBuilderService,
              private resourceBuilderService: ResourceBuilderService) {
  }

  ngOnInit(): void {
    this.damConfigStore.set();
    this.activatedRoute.params.subscribe((params) => {
      this.serviceTemplate = params.serviceTemplate;
    });
  }

  save() {
    if (!this.validate(this.quickstartForm)) {
      return;
    }

    const { collection, accessPolicyValue, variables } = this.quickstartForm.getModel();
    const accessLevel: AccessLevel = this.quickstartForm.accessLevelRadio.value;
    const accessPolicyId: AccessPolicyType = this.quickstartForm.accessPolicyRadio.value;

    this.accessPolicyBuilderService.createReusableAccessPolicy(accessPolicyId)
      .pipe(
        flatMap((_) => {
          return this.resourceBuilderService.createResource(
            collection, this.serviceTemplate, variables, accessLevel, accessPolicyId, accessPolicyValue
          );
        })
      )
      .subscribe(() => {
        this.router.navigate([`../../../../advanced/resources/${collection}`], { relativeTo: this.activatedRoute });
      }, this.showError);
  }

  private validate(form: Form): boolean {
    this.formErrorMessage = null;
    this.isFormValid = this.validationService.validate(form);
    this.isFormValidated = true;
    return this.isFormValid;
  }

  private showError = ({ error }: HttpErrorResponse) => {
    const { details } = error;
    details.forEach(errorDetail => {
      if (!this.isConfigModification(errorDetail['@type'])) {
        this.formErrorMessage = errorDetail['description'];
        this.isFormValid = false;
        this.isFormValidated = true;
      }
    });
  }

  private isConfigModification(errorType: string) {
    return errorType.includes('ConfigModification');
  }

}
