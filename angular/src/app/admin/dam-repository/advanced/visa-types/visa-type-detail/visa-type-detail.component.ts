import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { VisaTypeFormComponent } from '../visa-type-form/visa-type-form.component';
import { VisaTypeService } from '../visa-types.service';
import { VisaTypesStore } from '../visa-types.store';

@Component({
  selector: 'ddap-visa-type-detail',
  templateUrl: './visa-type-detail.component.html',
  styleUrls: ['./visa-type-detail.component.scss'],
  providers: [FormValidationService],
})
export class VisaTypeDetailComponent extends DamConfigEntityDetailComponentBaseDirective<VisaTypesStore> implements OnInit {

  @ViewChild(VisaTypeFormComponent)
  claimDefinitionForm: VisaTypeFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected claimDefinitionsStore: VisaTypesStore,
    protected dialog: MatDialog,
    private claimDefinitionService: VisaTypeService
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
