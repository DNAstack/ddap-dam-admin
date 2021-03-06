import { Injectable } from '@angular/core';

import { DamConfigEntityStore } from '../../shared/dam/dam-config-entity-store';
import { DamConfigEntityType } from '../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../shared/dam/dam-config.store';

@Injectable({
  providedIn: 'root',
})
export class PersonasStore extends DamConfigEntityStore {

  constructor(protected damConfigStore: DamConfigStore) {
    super(DamConfigEntityType.personas, damConfigStore);
  }

}
