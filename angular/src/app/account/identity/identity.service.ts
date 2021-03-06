import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Identity } from './identity.model';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getIdentity(params = {}): Observable<Identity> {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Can't load account's information.`, true)
      );
  }

  refreshAccessTokens(params?) {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/refresh`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Can't load account's information.`, true)
      );
  }

  invalidateAccessTokens(params?) {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/logout`, {params});
  }

}
