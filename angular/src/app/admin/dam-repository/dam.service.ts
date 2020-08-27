import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserDamInfoAccess } from '../../shared/user-dam-info-access.model';

@Injectable({
  providedIn: 'root',
})
export class DamService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  getDamInfoAndUserAccess(params = {}): Observable<UserDamInfoAccess> {
    return this.http.get<UserDamInfoAccess>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/dam/info`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

}
