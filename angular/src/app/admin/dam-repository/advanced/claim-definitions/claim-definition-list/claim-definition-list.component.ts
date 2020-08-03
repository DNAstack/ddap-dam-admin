import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClaimDefinitionService } from '../claim-definitions.service';
import { ClaimDefinitionsStore } from '../claim-definitions.store';

@Component({
  selector: 'ddap-claim-definition-list',
  templateUrl: './claim-definition-list.component.html',
  styleUrls: ['./claim-definition-list.component.scss'],
})
export class ClaimDefinitionListComponent extends DamConfigEntityListComponentBaseDirective<ClaimDefinitionsStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'infoUrl', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected claimDefinitionsStore: ClaimDefinitionsStore,
    protected dialog: MatDialog,
    private claimDefinitionService: ClaimDefinitionService
  ) {
    super(route, damConfigStore, claimDefinitionsStore, dialog);
  }

  protected delete(id: string): void {
    this.claimDefinitionService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
