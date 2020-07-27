import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { AuditlogResponseModel } from './auditlog.model';

@Injectable({
  providedIn: 'root',
})
export class AuditlogsService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getLogs(user: string, filter: string, pageSize: string, nextPageToken?: string): Observable<AuditlogResponseModel> {
    return this.http.get<AuditlogResponseModel>(`${environment.damApiUrl}/users/${user}/auditlogs`
      + `?page_size=${pageSize}&page_token=${nextPageToken || ''}&filter=${filter || ''}`
      )
      .pipe(
        this.errorHandler.notifyOnError(`Can't load audit logs for user ${user}.`)
      );
  }

}
