import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ServiceDefinitionsStore } from '../service-definitions.store';

@Component({
  selector: 'ddap-service-definition-list',
  templateUrl: './service-definition-list.component.html',
  styleUrls: ['./service-definition-list.component.scss'],
})
export class ServiceDefinitionListComponent extends DamConfigEntityListComponentBaseDirective<ServiceDefinitionsStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'targetAdapter', 'itemFormat', 'interfaces', 'roles', 'moreActions'];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected serviceDefinitionsStore: ServiceDefinitionsStore) {
    super(route, damConfigStore, serviceDefinitionsStore);
  }

}
