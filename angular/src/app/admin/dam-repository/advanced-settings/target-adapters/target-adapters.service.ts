import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TargetAdaptersService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  getTargetAdapters(): Observable<Object> {
    return this.http.get(
      `${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/dam/target-adapters`
    ).pipe(
      this.errorHandler.notifyOnError(`Can't load target adapters.`, true)
    );
  }

}
