import { Store } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from "rxjs/operators";

import { DamConfigEntityType } from './dam-config-entity-type.enum';
import { DamConfigStore } from './dam-config.store';

export class DamConfigEntityStore extends Store<Map<string, EntityModel>> {

  constructor(protected entityType: DamConfigEntityType,
              protected damConfigStore: DamConfigStore) {
    super(new Map<string, EntityModel>());
    this.init();
  }

  public getAsList(innerMapFn?): Observable<any[]> {
    return this.state$
      .pipe(
        map((values) => {
          if (!values) {
            return [];
          }
          return values;
        }),
        map(EntityModel.arrayFromMap),
        map(issuerList => innerMapFn ? issuerList.map(innerMapFn) : issuerList)
      );
  }

  private init(): void {
    this.damConfigStore.state$
      .pipe(
        pluck(this.entityType),
        map(EntityModel.objectToMap)
      )
      .subscribe((entities: Map<string, EntityModel>) => {
        this.setState(entities);
      });
  }

}
