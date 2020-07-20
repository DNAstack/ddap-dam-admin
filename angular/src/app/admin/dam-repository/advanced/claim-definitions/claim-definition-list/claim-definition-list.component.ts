import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClaimDefinitionsStore } from '../claim-definitions.store';

@Component({
  selector: 'ddap-claim-definition-list',
  templateUrl: './claim-definition-list.component.html',
  styleUrls: ['./claim-definition-list.component.scss'],
})
export class ClaimDefinitionListComponent extends DamConfigEntityListComponentBaseDirective<ClaimDefinitionsStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'infoUrl', 'moreActions'];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected claimDefinitionsStore: ClaimDefinitionsStore) {
    super(route, damConfigStore, claimDefinitionsStore);
  }

}
