import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { dam } from '../../../../shared/proto/dam-service';
import ITokensResponse = dam.v1.ITokensResponse;

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  constructor(private http: HttpClient) { }

  getTokens(): Observable<ITokensResponse> {
    return this.http.get<ITokensResponse>(`/api/v1alpha/realm/${realmIdPlaceholder}/tokens`);
  }

  revokeToken(tokenId: string) {
    return this.http.delete(`api/v1alpha/realm/${realmIdPlaceholder}/tokens/${tokenId}`);
  }
}
