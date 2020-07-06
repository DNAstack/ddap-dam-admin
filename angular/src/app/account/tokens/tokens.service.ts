import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { tokens } from '../../shared/proto/dam-service';

import ListTokensResponse = tokens.v1.ListTokensResponse;

@Injectable({
  providedIn: 'root',
})
export class TokensService {

  constructor(private http: HttpClient) { }

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
