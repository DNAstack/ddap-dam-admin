import { Directive, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteActionConfirmationDialogComponent, FormValidationService } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DamConfigEntityFormComponentBase } from './dam-config-entity-form-component.base';
import { DamConfigEntityStore } from './dam-config-entity-store';
import { DamConfigStore } from './dam-config.store';

@Directive()
export abstract class DamConfigEntityDetailComponentBaseDirective<T extends DamConfigEntityStore>
  extends DamConfigEntityFormComponentBase implements OnInit, OnDestroy {

  entity: EntityModel;

  private subscription: Subscription;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected entityDamConfigStore: T,
    protected dialog: MatDialog
  ) {
    super(route, router, validationService);
  }

  get entityId() {
    return this.route.snapshot.params.entityId;
  }

  ngOnInit() {
    this.damConfigStore.set();
    this.subscription = this.entityDamConfigStore.state$
      .pipe(
        map((entities) => {
          if (entities) {
            return entities.get(this.entityId);
          }
        })
      ).subscribe((entity) => {
        this.entity = entity;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openConfirmationDialog() {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: _get(this.entity, 'dto.ui.label', this.entity.name),
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.delete();
        }
      });
  }

  protected abstract delete();

}
