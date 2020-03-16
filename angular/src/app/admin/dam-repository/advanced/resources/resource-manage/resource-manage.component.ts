import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineForms, FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import { Observable, Subject } from 'rxjs';

import { DamConfigEntityManageComponentBase } from '../../../shared/dam/dam-config-entity-manage-component.base';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ResourceAccessComponent } from '../resource-access/resource-access.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceService } from '../resources.service';

@Component({
  selector: 'ddap-resource-manage',
  templateUrl: './resource-manage.component.html',
  styleUrls: ['./resource-manage.component.scss'],
  providers: [FormValidationService],
})
export class ResourceManageComponent extends DamConfigEntityManageComponentBase {

  @ViewChild(ResourceFormComponent, { static: false })
  resourceForm: ResourceFormComponent;
  @ViewChild('accessForm', { static: false })
  accessForm: ResourceAccessComponent;

  private errors: Subject<any> = new Subject();

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              public resourceService: ResourceService) {
    super(route, router, validationService, damConfigStore);
    this.errors
      .subscribe(() => {
        },
        (error) => {
          this.errors.next(error);
        });
  }

  save(isDryRun = false) {
    const aggregateForm = combineForms(this.resourceForm, this.accessForm);
    if (!isDryRun && !this.validate(this.accessForm.form ? aggregateForm : this.resourceForm)) {
      return;
    }

    const resourceModel: EntityModel = this.resourceForm.getModel();
    const applyModel = this.accessForm.getApplyModel(isDryRun) || {};
    const change = new ConfigModificationModel(resourceModel.dto, applyModel);
    this.resourceService.save(resourceModel.name, change);
    return this.resourceService.save(resourceModel.name, change)
      .subscribe(() => {
        if (!isDryRun) {
          this.navigateUp('../..');
        }
      }, (error) => {
        if (isDryRun) {
          this.errors.next(error);
        } else {
          this.handleError(isDryRun, error);
        }
      });
  }

  handleError = (isDryRun: boolean, { error }) => {
    if (error instanceof Object) {
      const errorDetails: object[] = error.details;
      errorDetails.forEach(details => {
        if (this.isConfigModification(details['@type'])) {
          this.accessForm.makeFieldsValid();
          this.accessForm.validatePersonaFields(details);
        } else {
          if (details['resourceName'].includes('views')) {
            this.resourceForm.setFormControlErrors(details);
          } else {
            this.displayFieldErrorMessage(error, 'resources', this.resourceForm.form);
          }
        }
      });
    } else if (!isDryRun) {
      this.showError(error);
    }
  }

  executeDryRun() {
    this.save(true);
  }

}
