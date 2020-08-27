import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityModel, ErrorHandlerService } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { DamConfigEntityType } from '../../shared/dam/dam-config-entity-type.enum';
import { DamConfigService } from '../../shared/dam/dam-config.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceService extends DamConfigService {

  constructor(http: HttpClient,
              protected errorHandler: ErrorHandlerService) {
    super(DamConfigEntityType.resources, http, errorHandler);
  }

  getResource(resourceName: string): Observable<EntityModel> {
    return this.get()
      .pipe(
        pluck(DamConfigEntityType.resources),
        map(EntityModel.objectToMap),
        map(resources => resources.get(resourceName))
      );
  }

}
