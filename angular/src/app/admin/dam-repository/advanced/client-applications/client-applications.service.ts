import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigModificationModel, ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DamConfigEntityType } from '../../shared/dam/dam-config-entity-type.enum';
import { DamConfigService } from '../../shared/dam/dam-config.service';

@Injectable({
  providedIn: 'root',
})
export class ClientApplicationService extends DamConfigService {

  constructor(protected http: HttpClient,
              protected route: ActivatedRoute,
              protected errorHandler: ErrorHandlerService) {
    super(DamConfigEntityType.clients, http);
  }

  update(entityId: string, change: ConfigModificationModel): Observable<any> {
    return this.http.patch(`${environment.damApiUrl}/${realmIdPlaceholder}/config/${this.entityType}/${entityId}`,
      change
    );
  }
}
