import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import ListConsentsResponse = consents.v1.ListConsentsResponse;
import { environment } from '../../../environments/environment';
import { consents } from '../../shared/proto/dam-service';

@Injectable({
  providedIn: 'root',
})
export class ConsentsService {
  constructor(private http: HttpClient) {}

  getConsents(userId: string, params = {}): Observable<ListConsentsResponse> {
    return this.http.get<ListConsentsResponse>(
      `${environment.damApiUrl}/${realmIdPlaceholder}`
      + `/users/${encodeURIComponent(userId)}/consents`,
      { params }
    );
  }

  revokeConsent(userId: string, consentId: string): Observable<null> {
    return this.http.delete<any>(
      `${environment.damApiUrl}/${realmIdPlaceholder}`
      + `/users/${encodeURIComponent(userId)}/consents/${encodeURIComponent(consentId)}`
    );
  }
}
