import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { PassportIssuersStore } from '../passport-issuers.store';

@Component({
  selector: 'ddap-passport-issuer-list',
  templateUrl: './passport-issuer-list.component.html',
  styleUrls: ['./passport-issuer-list.component.scss'],
})
export class PassportIssuerListComponent extends DamConfigEntityListComponentBaseDirective<PassportIssuersStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'clientId', 'issuer', 'authUrl', 'tokenUrl', 'moreActions'];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected passportIssuersStore: PassportIssuersStore) {
    super(route, damConfigStore, passportIssuersStore);
  }

}
