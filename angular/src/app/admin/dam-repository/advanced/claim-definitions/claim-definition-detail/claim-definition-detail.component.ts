import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClaimDefinitionFormComponent } from '../claim-definition-form/claim-definition-form.component';
import { ClaimDefinitionService } from '../claim-definitions.service';
import { ClaimDefinitionsStore } from '../claim-definitions.store';

@Component({
  selector: 'ddap-claim-definition-detail',
  templateUrl: './claim-definition-detail.component.html',
  styleUrls: ['./claim-definition-detail.component.scss'],
  providers: [FormValidationService],
})
export class ClaimDefinitionDetailComponent extends DamConfigEntityDetailComponentBaseDirective<ClaimDefinitionsStore> implements OnInit {

  @ViewChild(ClaimDefinitionFormComponent)
  claimDefinitionForm: ClaimDefinitionFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected claimDefinitionsStore: ClaimDefinitionsStore,
    protected dialog: MatDialog,
    private claimDefinitionService: ClaimDefinitionService
  ) {
    super(route, router, validationService, damConfigStore, claimDefinitionsStore, dialog);
  }

  update() {
    if (!this.validate(this.claimDefinitionForm)) {
      return;
    }

    const claimDefinition: EntityModel = this.claimDefinitionForm.getModel();
    const change = new ConfigModificationModel(claimDefinition.dto, {});
    this.claimDefinitionService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.claimDefinitionForm.form);
  }

  protected delete() {
    this.claimDefinitionService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

}
