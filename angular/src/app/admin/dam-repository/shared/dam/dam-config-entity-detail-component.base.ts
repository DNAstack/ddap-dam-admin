import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DamConfigEntityFormComponentBase } from './dam-config-entity-form-component.base';
import { DamConfigEntityStore } from './dam-config-entity-store';
import { DamConfigStore } from './dam-config.store';

@Directive()
export class DamConfigEntityDetailComponentBaseDirective<T extends DamConfigEntityStore>
  extends DamConfigEntityFormComponentBase implements OnInit, OnDestroy {

  entity: EntityModel;

  private subscription: Subscription;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              protected entityDamConfigStore: T) {
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

}
