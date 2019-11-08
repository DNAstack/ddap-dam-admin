import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityModel, ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { HttpParamsService } from '../../../shared/http-params.service';
import { dam } from '../../../shared/proto/dam-service';
import { DamConfigEntityType } from '../shared/dam/dam-config-entity-type.enum';
import GetTokenResponse = dam.v1.GetTokenResponse;
import IGetTokenRequest = dam.v1.IGetTokenRequest;
import { DamConfigService } from '../shared/dam/dam-config.service';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ResourceService extends DamConfigService {

  constructor(http: HttpClient,
              private httpParamsService: HttpParamsService,
              protected errorHandler: ErrorHandlerService) {
    super(DamConfigEntityType.resources, http);
  }

  getResource(resourceName: string): Observable<EntityModel> {
    return this.get()
      .pipe(
        pluck(DamConfigEntityType.resources),
        map(EntityModel.objectToMap),
        map(resources => resources.get(resourceName))
      );
  }

  getAccessRequestToken(resourceId: string, viewId: string, tokenRequest: IGetTokenRequest): Observable<GetTokenResponse> {
    return this.http.get<GetTokenResponse>(`${environment.damApiUrl}/${realmIdPlaceholder}/resources/${resourceId}/views/${viewId}/token`,
      {
        params: this.httpParamsService.getHttpParamsFrom(tokenRequest),
      }
    ).pipe(
      this.errorHandler.notifyOnError(`Can't get access token.`),
      map(GetTokenResponse.create)
    );
  }

}
