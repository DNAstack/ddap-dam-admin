import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineForms, FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import { Subject } from 'rxjs';

import { DamConfigEntityManageComponentBase } from '../../../shared/dam/dam-config-entity-manage-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
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
          this.translateViewPaths(error);
          this.displayFieldErrorMessage(error, DamConfigEntityType.resources, this.resourceForm.form);
        }
      });
    } else if (!isDryRun) {
      this.showError(error);
    }
  }

  executeDryRun() {
    if (this.resourceForm) {
      this.save(true);
    }
  }

  /**
   * When new View is added we create a new form controller with assigned id such as `zyx_1585646705796`. Each view has
   * field 'name' which is basically the id provided by user. Requests to DAM includes view correctly named using that
   * particular field for naming the View (see getModel), yet the controller is still named with the original assigned id.
   * This method translates paths from real view names to assigned controller names to make error handling working.
   */
  private translateViewPaths(error) {
    if ('details' in error) {
      const { name: resourceId }  = this.resourceForm.getModel();
      const viewNames = this.resourceForm.translateRealViewNamesToAssignedNames();

      error.details.forEach(( errorDetail ) => {
        const realViewName = Object.keys(viewNames)
          .find((viewName) => {
            const viewPath = `resources/${resourceId}/views/${viewName}/`;
            return errorDetail.resourceName.includes(viewPath);
          });

        const existingViewPath = `resources/${resourceId}/views/${realViewName}/`;
        const translatedViewPath = `resources/${resourceId}/views/${viewNames[realViewName]}/`;

        errorDetail.resourceName = errorDetail.resourceName.replace(existingViewPath, translatedViewPath);
      });
    }
  }

}
