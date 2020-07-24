import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'ddap-common-lib';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditlogsService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getLogs(user: string, pageSize: string, filter: string) {
    return this.http.get(`${environment.damApiUrl}/users/${user}/auditlogs?page_size=${pageSize}&filter=${filter}`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load audit logs for user ${user}.`)
      );
  }

}
