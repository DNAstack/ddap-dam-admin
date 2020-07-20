import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DamConfigEntityComponentBase } from './dam-config-entity-component.base';
import { DamConfigEntityStore } from './dam-config-entity-store';
import { DamConfigStore } from './dam-config.store';

@Directive()
export class DamConfigEntityListComponentBaseDirective<T extends DamConfigEntityStore>
  extends DamConfigEntityComponentBase implements OnInit {

  entities$: Observable<EntityModel[]>;

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected entityDamConfigStore: T) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(() => this.damConfigStore.set());
    this.entities$ = this.entityDamConfigStore.state$
      .pipe(
        map(EntityModel.arrayFromMap)
      );
  }
}
