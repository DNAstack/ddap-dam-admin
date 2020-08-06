import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { VisaSourcesFormComponent } from '../visa-sources-form/visa-sources-form.component';
import { VisaSourcesService } from '../visa-sources.service';
import { VisaSourcesStore } from '../visa-sources.store';

@Component({
  selector: 'ddap-visa-source-detail',
  templateUrl: './visa-sources-detail.component.html',
  styleUrls: ['./visa-sources-detail.component.scss'],
  providers: [FormValidationService],
})
export class VisaSourcesDetailComponent extends DamConfigEntityDetailComponentBaseDirective<VisaSourcesStore> implements OnInit {

  @ViewChild(VisaSourcesFormComponent)
  trustedSourcesForm: VisaSourcesFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected trustedSourcesStore: VisaSourcesStore,
    protected dialog: MatDialog,
    private trustedSourcesService: VisaSourcesService
  ) {
    super(route, router, validationService, damConfigStore, trustedSourcesStore, dialog);
  }

  update() {
    if (!this.validate(this.trustedSourcesForm)) {
      return;
    }

    const trustedSources: EntityModel = this.trustedSourcesForm.getModel();
    const change = new ConfigModificationModel(trustedSources.dto, {});
    this.trustedSourcesService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.trustedSources, this.trustedSourcesForm.form);
  }

  protected delete() {
    this.trustedSourcesService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

}
