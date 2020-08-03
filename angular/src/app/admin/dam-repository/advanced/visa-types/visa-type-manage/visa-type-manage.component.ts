import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityFormComponentBase } from '../../../shared/dam/dam-config-entity-form-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { VisaTypeFormComponent } from '../visa-type-form/visa-type-form.component';
import { VisaTypeService } from '../visa-types.service';

@Component({
  selector: 'ddap-visa-type-manage',
  templateUrl: './visa-type-manage.component.html',
  styleUrls: ['./visa-type-manage.component.scss'],
  providers: [FormValidationService],
})
export class VisaTypeManageComponent extends DamConfigEntityFormComponentBase {

  @ViewChild(VisaTypeFormComponent)
  claimDefinitionForm: VisaTypeFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              private claimDefinitionService: VisaTypeService) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.claimDefinitionForm)) {
      return;
    }

    const claimDefinition: EntityModel = this.claimDefinitionForm.getModel();
    const change = new ConfigModificationModel(claimDefinition.dto, {});
    this.claimDefinitionService.save(claimDefinition.name, change)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.claimDefinitionForm.form);
  }

}
