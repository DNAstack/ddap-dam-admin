import { Directive, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DeleteActionConfirmationDialogComponent, EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DamConfigEntityComponentBase } from './dam-config-entity-component.base';
import { DamConfigEntityStore } from './dam-config-entity-store';
import { DamConfigStore } from './dam-config.store';

@Directive()
export abstract class DamConfigEntityListComponentBaseDirective<T extends DamConfigEntityStore>

  extends DamConfigEntityComponentBase implements OnInit {

  entities$: Observable<EntityModel[]>;

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected entityDamConfigStore: T,
    protected dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(() => this.damConfigStore.set());
    this.entities$ = this.entityDamConfigStore.state$
      .pipe(
        map(EntityModel.arrayFromMap)
      );
  }

  openDeleteConfirmationDialog(id: string, label?: string) {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: label ? label : id,
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.delete(id);
        }
      });
  }

  protected abstract delete(id: string): void;

}
