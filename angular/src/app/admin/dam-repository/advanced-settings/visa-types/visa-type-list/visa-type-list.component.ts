import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { VisaTypeService } from '../visa-types.service';
import { VisaTypesStore } from '../visa-types.store';

@Component({
  selector: 'ddap-visa-type-list',
  templateUrl: './visa-type-list.component.html',
  styleUrls: ['./visa-type-list.component.scss'],
})
export class VisaTypeListComponent extends DamConfigEntityListComponentBaseDirective<VisaTypesStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'infoUrl', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected claimDefinitionsStore: VisaTypesStore,
    protected dialog: MatDialog,
    private claimDefinitionService: VisaTypeService
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
