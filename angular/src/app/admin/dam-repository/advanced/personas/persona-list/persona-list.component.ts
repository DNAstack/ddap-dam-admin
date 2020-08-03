import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { PersonaService } from '../personas.service';
import { PersonasStore } from '../personas.store';

@Component({
  selector: 'ddap-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss'],
})
export class PersonaListComponent extends DamConfigEntityListComponentBaseDirective<PersonasStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'standardClaims', 'ga4ghClaims', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected personasStore: PersonasStore,
    protected dialog: MatDialog,
    private personaService: PersonaService
  ) {
    super(route, damConfigStore, personasStore, dialog);
  }

  protected delete(id: string): void {
    this.personaService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
