import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { TrustedSourcesService } from '../trusted-sources.service';
import { TrustedSourcesStore } from '../trusted-sources.store';

@Component({
  selector: 'ddap-trusted-source-list',
  templateUrl: './trusted-sources-list.component.html',
  styleUrls: ['./trusted-sources-list.component.scss'],
})
export class TrustedSourcesListComponent
  extends DamConfigEntityListComponentBaseDirective<TrustedSourcesStore>
  implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'sources', 'visaTypes', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected trustedSourcesStore: TrustedSourcesStore,
    protected dialog: MatDialog,
    private trustedSourcesService: TrustedSourcesService
  ) {
    super(route, damConfigStore, trustedSourcesStore, dialog);
  }

  protected delete(id: string): void {
    this.trustedSourcesService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
