import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuditlogsService {
  auditLog = new BehaviorSubject({});
  currentAuditlog = this.auditLog.asObservable();
  constructor(private http: HttpClient) { }

  getLogs(user: string, pageSize: string) {
    return this.http.get(`${environment.damApiUrl}/users/${user}/auditlogs?page_size=${pageSize}`);
  }

  setCurrentAuditlog(log) {
    this.auditLog.next(log);
  }
}
