import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityFormComponentBase } from '../../../shared/dam/dam-config-entity-form-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { VisaSourcesFormComponent } from '../visa-sources-form/visa-sources-form.component';
import { VisaSourcesService } from '../visa-sources.service';

@Component({
  selector: 'ddap-visa-source-manage',
  templateUrl: './visa-sources-manage.component.html',
  styleUrls: ['./visa-sources-manage.component.scss'],
  providers: [FormValidationService],
})
export class VisaSourcesManageComponent extends DamConfigEntityFormComponentBase {

  @ViewChild(VisaSourcesFormComponent)
  trustedSourcesForm: VisaSourcesFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              private trustedSourcesService: VisaSourcesService) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.trustedSourcesForm)) {
      return;
    }

    const trustedSources: EntityModel = this.trustedSourcesForm.getModel();
    const change = new ConfigModificationModel(trustedSources.dto, {});
    this.trustedSourcesService.save(trustedSources.name, change)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.trustedSources, this.trustedSourcesForm.form);
  }

}
