import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClientApplicationsStore } from '../client-applications.store';

@Component({
  selector: 'ddap-client-application-list',
  templateUrl: './client-application-list.component.html',
  styleUrls: ['./client-application-list.component.scss'],
})
export class ClientApplicationListComponent extends DamConfigEntityListComponentBaseDirective<ClientApplicationsStore> implements OnInit {

  displayedColumns: string[] = [
    'label', 'description', 'clientId', 'scopes', 'redirectUris', 'grantTypes', 'responseTypes', 'moreActions',
  ];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected clientApplicationsStore: ClientApplicationsStore) {
    super(route, damConfigStore, clientApplicationsStore);
  }

}
