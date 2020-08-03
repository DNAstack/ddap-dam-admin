import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ResourceService } from '../resources.service';
import { ResourcesStore } from '../resources.store';

@Component({
  selector: 'ddap-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', maxHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ResourceListComponent
  extends DamConfigEntityListComponentBaseDirective<ResourcesStore>
  implements OnInit {

  expandedRow: string;
  displayedColumns: string[] = ['label', 'description', 'views', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected resourcesStore: ResourcesStore,
    protected dialog: MatDialog,
    private resourceService: ResourceService
  ) {
    super(route, damConfigStore, resourcesStore, dialog);
  }

  protected delete(id: string): void {
    this.resourceService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
