import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigModificationModel, EntityModel, FormValidationService } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBase } from '../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../shared/dam/dam-config.store';
import { AccessPolicyService } from '../access-policies.service';
import { AccessPoliciesStore } from '../access-policies.store';
import { AccessPolicyFormComponent } from '../access-policy-form/access-policy-form.component';

@Component({
  selector: 'ddap-access-policy-detail',
  templateUrl: './access-policy-detail.component.html',
  styleUrls: ['./access-policy-detail.component.scss'],
})
export class AccessPolicDetailComponent extends DamConfigEntityDetailComponentBase<AccessPoliciesStore> {

  @ViewChild(AccessPolicyFormComponent, { static: false })
  accessPolicyForm: AccessPolicyFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              protected accessPoliciesStore: AccessPoliciesStore,
              private accessPolicyService: AccessPolicyService) {
    super(route, router, validationService, damConfigStore, accessPoliciesStore);
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

  delete() {
    this.accessPolicyService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.accessPolicyForm.form);
  }

}
