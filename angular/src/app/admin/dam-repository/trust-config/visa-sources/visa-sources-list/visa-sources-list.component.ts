import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ellipseIfLongerThan } from 'ddap-common-lib';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { VisaSourcesService } from '../visa-sources.service';
import { VisaSourcesStore } from '../visa-sources.store';

@Component({
  selector: 'ddap-visa-source-list',
  templateUrl: './visa-sources-list.component.html',
  styleUrls: ['./visa-sources-list.component.scss'],
})
export class VisaSourcesListComponent
  extends DamConfigEntityListComponentBaseDirective<VisaSourcesStore>
  implements OnInit {

  readonly displayedColumns: string[] = ['label', 'description', 'sources', 'visaTypes', 'moreActions'];
  readonly ellipseIfLongerThan: Function = ellipseIfLongerThan;

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected trustedSourcesStore: VisaSourcesStore,
    protected dialog: MatDialog,
    private trustedSourcesService: VisaSourcesService
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
