import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { tokens } from '../../proto/dam-service';


@Injectable({
  providedIn: 'root',
})
export class SessionsService {

  constructor(private http: HttpClient) {
  }

  getTokens(userId: string, params = {}): Observable<ListTokensResponse> {
    return this.http.get<ListTokensResponse>(`${environment.ddapApiUrl}`
      + `/realm/${realmIdPlaceholder}/users/${encodeURIComponent(userId)}/tokens`, { params });
  }

  revokeToken(userId: string, tokenId: string): Observable<null> {
    return this.http.delete<any>(`${environment.damApiUrl}`
      + `/users/${encodeURIComponent(userId)}/tokens/${encodeURIComponent(tokenId)}`
    );
  }

}
