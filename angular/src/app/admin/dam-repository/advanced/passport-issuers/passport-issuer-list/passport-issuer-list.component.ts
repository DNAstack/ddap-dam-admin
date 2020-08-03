import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { PassportIssuerService } from '../passport-issuers.service';
import { PassportIssuersStore } from '../passport-issuers.store';

@Component({
  selector: 'ddap-passport-issuer-list',
  templateUrl: './passport-issuer-list.component.html',
  styleUrls: ['./passport-issuer-list.component.scss'],
})
export class PassportIssuerListComponent
  extends DamConfigEntityListComponentBaseDirective<PassportIssuersStore>
  implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'clientId', 'issuer', 'authUrl', 'tokenUrl', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected passportIssuersStore: PassportIssuersStore,
    protected dialog: MatDialog,
    private passportIssuerService: PassportIssuerService
  ) {
    super(route, damConfigStore, passportIssuersStore, dialog);
  }

  protected delete(id: string): void {
    this.passportIssuerService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
