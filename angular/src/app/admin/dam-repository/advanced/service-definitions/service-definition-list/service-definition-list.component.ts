import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ServiceDefinitionService } from '../service-definitions.service';
import { ServiceDefinitionsStore } from '../service-definitions.store';

@Component({
  selector: 'ddap-service-definition-list',
  templateUrl: './service-definition-list.component.html',
  styleUrls: ['./service-definition-list.component.scss'],
})
export class ServiceDefinitionListComponent
  extends DamConfigEntityListComponentBaseDirective<ServiceDefinitionsStore>
  implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'targetAdapter', 'itemFormat', 'interfaces', 'roles', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected serviceDefinitionsStore: ServiceDefinitionsStore,
    protected dialog: MatDialog,
    public serviceDefinitionService: ServiceDefinitionService
  ) {
    super(route, damConfigStore, serviceDefinitionsStore, dialog);
  }

  protected delete(id: string): void {
    this.serviceDefinitionService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
