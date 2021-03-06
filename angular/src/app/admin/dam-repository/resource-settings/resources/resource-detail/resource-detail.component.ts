import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineForms, FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ResourceAccessComponent } from '../resource-access/resource-access.component';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { ResourceService } from '../resources.service';
import { ResourcesStore } from '../resources.store';

@Component({
  selector: 'ddap-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss'],
  providers: [FormValidationService],
})
export class ResourceDetailComponent extends DamConfigEntityDetailComponentBaseDirective<ResourcesStore> implements OnInit {

  @ViewChild(ResourceFormComponent)
  resourceForm: ResourceFormComponent;
  @ViewChild('accessForm')
  accessForm: ResourceAccessComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected resourcesStore: ResourcesStore,
    protected dialog: MatDialog,
    private resourceService: ResourceService
  ) {
    super(route, router, validationService, damConfigStore, resourcesStore, dialog);
  }

  update(isDryRun = false) {
    const aggregateForm = combineForms(this.resourceForm, this.accessForm);
    if (!isDryRun && !this.validate(this.accessForm.form ? aggregateForm : this.resourceForm)) {
      return;
    }
    const resourceModel: EntityModel = this.resourceForm.getModel();
    const applyModel = this.accessForm.getApplyModel(isDryRun) || {};
    const change = new ConfigModificationModel(resourceModel.dto, applyModel);
    this.resourceService.update(this.entity.name, change)
      .subscribe(() => {
        if (!isDryRun) {
          this.navigateUp('..');
        } else {
          this.resourceForm.makeFieldsValid();
          this.clearError();
        }
      }, (error) => this.handleError(isDryRun, error));
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
      this.update(true);
    }
  }

  protected delete() {
    this.resourceService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.showError);
  }

  /**
   * When new View is added we create a new form controller with assigned id such as `zyx_1585646705796`. Each view has
   * field 'name' which is basically the id provided by user. Requests to DAM includes view correctly named using that
   * particular field for naming the View (see getModel), yet the controller is still named with the original assigned id.
   * This method translates paths from real view names to assigned controller names to make error handling working.
   */
  private translateViewPaths(error) {
    if ('details' in error) {
      const viewNames = this.resourceForm.translateRealViewNamesToAssignedNames();

      error.details.forEach(( errorDetail ) => {
        const realViewName = Object.keys(viewNames)
          .find((viewName) => {
            const viewPath = `resources/${this.entity.name}/views/${viewName}/`;
            return errorDetail.resourceName.includes(viewPath);
          });

        const existingViewPath = `resources/${this.entity.name}/views/${realViewName}/`;
        const translatedViewPath = `resources/${this.entity.name}/views/${viewNames[realViewName]}/`;

        errorDetail.resourceName = errorDetail.resourceName.replace(existingViewPath, translatedViewPath);
      });
    }
  }

}
