import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListConsentsResponse = consents.v1.ListConsentsResponse;
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { consents } from '../../proto/dam-service';

@Injectable({
  providedIn: 'root',
})
export class ConsentsService {

  constructor(private http: HttpClient) {
  }

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
