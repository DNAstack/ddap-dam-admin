import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigModificationModel, EntityModel, FormValidationService } from 'ddap-common-lib';

import { DamConfigEntityManageComponentBaseDirective } from '../../../shared/dam/dam-config-entity-manage-component-base.directive';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessPolicyService } from '../access-policies.service';
import { AccessPolicyFormComponent } from '../access-policy-form/access-policy-form.component';

@Component({
  selector: 'ddap-access-policy-manage',
  templateUrl: './access-policy-manage.component.html',
  styleUrls: ['./access-policy-manage.component.scss'],
})
export class AccessPolicyManageComponent extends DamConfigEntityManageComponentBaseDirective {

  @ViewChild(AccessPolicyFormComponent)
  accessPolicyForm: AccessPolicyFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              private accessPolicyService: AccessPolicyService) {
    super(route, router, validationService, damConfigStore);
  }

  save() {
    if (!this.validate(this.accessPolicyForm)) {
      return;
    }

    const accessPolicy: EntityModel = this.accessPolicyForm.getModel();
    const change = new ConfigModificationModel(accessPolicy.dto, {});
    this.accessPolicyService.save(accessPolicy.name, change)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.accessPolicyForm.form);
  }

}
