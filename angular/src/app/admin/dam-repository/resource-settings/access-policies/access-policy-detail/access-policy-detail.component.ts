import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigModificationModel, DeleteActionConfirmationDialogComponent, EntityModel, FormValidationService } from 'ddap-common-lib';
import _get from 'lodash.get';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessPolicyService } from '../access-policies.service';
import { AccessPoliciesStore } from '../access-policies.store';
import { AccessPolicyFormComponent } from '../access-policy-form/access-policy-form.component';

@Component({
  selector: 'ddap-access-policy-detail',
  templateUrl: './access-policy-detail.component.html',
  styleUrls: ['./access-policy-detail.component.scss'],
})
export class AccessPolicyDetailComponent extends DamConfigEntityDetailComponentBaseDirective<AccessPoliciesStore> {

  @ViewChild(AccessPolicyFormComponent)
  accessPolicyForm: AccessPolicyFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected accessPoliciesStore: AccessPoliciesStore,
    protected dialog: MatDialog,
    private accessPolicyService: AccessPolicyService
  ) {
    super(route, router, validationService, damConfigStore, accessPoliciesStore, dialog);
  }

  update() {
    if (!this.validate(this.accessPolicyForm)) {
      return;
    }

    const accessPolicy: EntityModel = this.accessPolicyForm.getModel();
    const change = new ConfigModificationModel(accessPolicy.dto, {});
    this.accessPolicyService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.accessPolicyForm.form);
  }

  openDeleteConfirmationDialog() {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: _get(this.entity, 'dto.ui.label', this.entity.name),
      },
    }).afterClosed()
      .subscribe(({ acknowledged }) => {
        if (acknowledged) {
          this.delete();
        }
      });
  }

  protected delete() {
    this.accessPolicyService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

}
