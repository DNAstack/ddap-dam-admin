import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBase } from '../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigStore } from '../../shared/dam/dam-config.store';
import { ServiceDefinitionFormComponent } from '../service-definition-form/service-definition-form.component';
import { ServiceDefinitionService } from '../service-definitions.service';
import { ServiceDefinitionsStore } from '../service-definitions.store';

@Component({
  selector: 'ddap-service-definition-detail',
  templateUrl: './service-definition-detail.component.html',
  styleUrls: ['./service-definition-detail.component.scss'],
})
export class ServiceDefinitionDetailComponent extends DamConfigEntityDetailComponentBase<ServiceDefinitionsStore> implements OnInit {
  @ViewChild(ServiceDefinitionFormComponent, {static: false})
  serviceDefinitionForm: ServiceDefinitionFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              protected serviceDefinitionsStore: ServiceDefinitionsStore,
              public serviceDefinitionService: ServiceDefinitionService) {
    super(route, router, validationService, damConfigStore, serviceDefinitionsStore);
  }

  delete(): void {
    this.serviceDefinitionService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.showError);
  }

  update(): void {
    if (!this.validate(this.serviceDefinitionForm)) {
      return;
    }
    const serviceTemplate: EntityModel = this.serviceDefinitionForm.getModel();
    const change = new ConfigModificationModel(serviceTemplate.dto, {});
    this.serviceDefinitionService.update(serviceTemplate.name, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  handleError = (response) => {
    const { error } = response;
    if ( error instanceof Object) {
      this.serviceDefinitionForm.displayError(error);
    } else {
      this.showError(response);
    }
  }
}
