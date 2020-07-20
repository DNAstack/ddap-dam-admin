import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { TrustedSourcesStore } from '../trusted-sources.store';

@Component({
  selector: 'ddap-trusted-source-list',
  templateUrl: './trusted-sources-list.component.html',
  styleUrls: ['./trusted-sources-list.component.scss'],
})
export class TrustedSourcesListComponent extends DamConfigEntityListComponentBaseDirective<TrustedSourcesStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'sources', 'claims', 'moreActions'];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected trustedSourcesStore: TrustedSourcesStore) {
    super(route, damConfigStore, trustedSourcesStore);
  }

}
