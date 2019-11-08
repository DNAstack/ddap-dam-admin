import { HttpClient } from '@angular/common/http';
import { ConfigModificationModel, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { dam } from '../../../../shared/proto/dam-service';

import { DamConfigEntityType } from './dam-config-entity-type.enum';

import DamConfig = dam.v1.DamConfig;
import { environment } from "../../../../../environments/environment";

export abstract class DamConfigService {

  protected constructor(protected entityType: DamConfigEntityType,
                        protected http: HttpClient) {
  }

  get(params = {}): Observable<DamConfig> {
    return this.http.get<DamConfig>(`${environment.damApiUrl}/${realmIdPlaceholder}/config`, { params })
      .pipe(
        map(DamConfig.create)
      );
  }

  save(entityId: string, change: ConfigModificationModel): Observable<any> {
    return this.http.post(`${environment.damApiUrl}/${realmIdPlaceholder}/config/${this.entityType}/${entityId}`,
      change
    );
  }

  update(entityId: string, change: ConfigModificationModel): Observable<any> {
    return this.http.put(`${environment.damApiUrl}/${realmIdPlaceholder}/config/${this.entityType}/${entityId}`,
      change
    );
  }

  remove(entityId: string, change: ConfigModificationModel = null): Observable<any> {
    return this.http.request('delete', `${environment.damApiUrl}/${realmIdPlaceholder}/config/${this.entityType}/${entityId}`,
      {
        body: change,
      }
    );
  }

}
