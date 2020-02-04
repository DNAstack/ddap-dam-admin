import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DamConfigEntityType } from '../shared/dam/dam-config-entity-type.enum';
import { DamConfigService } from '../shared/dam/dam-config.service';
import { TargetAdapterVariables } from '../target-adapters/target-adapter-variables.model';

import { DamRoleCategories } from './service-definitions.constant';

@Injectable({
  providedIn: 'root',
})
export class ServiceDefinitionService extends DamConfigService {

  constructor(http: HttpClient,
              protected errorHandler: ErrorHandlerService) {
    super(DamConfigEntityType.serviceTemplates, http);
  }

  getTargetAdapterVariables(serviceTemplateId: string, params: {} = {}): Observable<TargetAdapterVariables> {
    return this.http.get<TargetAdapterVariables>(
      `${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/dam/service-templates/${serviceTemplateId}/variables`,
      {params}
    );
  }

  getDamRoleCategories(): string[] {
    return Object.values(DamRoleCategories);
  }

}
