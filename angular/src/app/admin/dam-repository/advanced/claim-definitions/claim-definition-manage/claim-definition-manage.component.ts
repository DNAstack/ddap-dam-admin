import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityFormComponentBase } from '../../../shared/dam/dam-config-entity-form-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { ClaimDefinitionFormComponent } from '../claim-definition-form/claim-definition-form.component';
import { ClaimDefinitionService } from '../claim-definitions.service';

@Component({
  selector: 'ddap-claim-definition-manage',
  templateUrl: './claim-definition-manage.component.html',
  styleUrls: ['./claim-definition-manage.component.scss'],
  providers: [FormValidationService],
})
export class ClaimDefinitionManageComponent extends DamConfigEntityFormComponentBase {

  @ViewChild(ClaimDefinitionFormComponent)
  claimDefinitionForm: ClaimDefinitionFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              private claimDefinitionService: ClaimDefinitionService) {
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
