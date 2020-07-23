import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'ddap-common-lib';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditlogsService {

  readonly auditLog = new BehaviorSubject({});
  readonly currentAuditlog$ = this.auditLog.asObservable();

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

  setCurrentAuditlog(log) {
    this.auditLog.next(log);
  }

}
