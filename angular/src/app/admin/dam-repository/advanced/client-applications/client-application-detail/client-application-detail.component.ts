import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import {
  DamConfigEntityDetailComponentBaseDirective
} from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClientApplicationFormComponent } from '../client-application-form/client-application-form.component';
import { ClientApplicationService } from '../client-applications.service';
import { ClientApplicationsStore } from '../client-applications.store';

@Component({
  selector: 'ddap-client-application-detail',
  templateUrl: './client-application-detail.component.html',
  styleUrls: ['./client-application-detail.component.scss'],
  providers: [FormValidationService],
})
export class ClientApplicationDetailComponent
  extends DamConfigEntityDetailComponentBaseDirective<ClientApplicationsStore>
  implements OnInit {

  @ViewChild(ClientApplicationFormComponent)
  clientApplicationForm: ClientApplicationFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              protected clientApplicationsStore: ClientApplicationsStore,
              private clientApplicationService: ClientApplicationService) {
    super(route, router, validationService, damConfigStore, clientApplicationsStore);
  }

  update() {
    if (!this.validate(this.clientApplicationForm)) {
      return;
    }

    const clientApplication: EntityModel = this.clientApplicationForm.getModel();
    const change = new ConfigModificationModel(clientApplication.dto, {});
    this.clientApplicationService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  delete() {
    this.clientApplicationService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.clientApplicationForm.form);
  }

}
