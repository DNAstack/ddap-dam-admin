import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityFormComponentBase } from '../../shared/dam/dam-config-entity-form-component.base';
import { ServiceDefinitionFormComponent } from '../service-definition-form/service-definition-form.component';
import { ServiceDefinitionService } from '../service-definitions.service';

@Component({
  selector: 'ddap-service-definition-manage',
  templateUrl: './service-definition-manage.component.html',
  styleUrls: ['./service-definition-manage.component.scss'],
})
export class ServiceDefinitionManageComponent extends DamConfigEntityFormComponentBase {

  @ViewChild(ServiceDefinitionFormComponent, {static: false})
  serviceDefinitionForm: ServiceDefinitionFormComponent;

  constructor(private serviceDefinitionService: ServiceDefinitionService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected  validationService: FormValidationService) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.serviceDefinitionForm)) {
      return;
    }
    const serviceTemplate: EntityModel = this.serviceDefinitionForm.getModel();
    const change = new ConfigModificationModel(serviceTemplate.dto, {});
    this.serviceDefinitionService.save(serviceTemplate.name, change)
      .subscribe(() => this.navigateUp('../..'), this.showError);
  }
}
