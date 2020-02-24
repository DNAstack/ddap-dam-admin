import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  constructor(private http: HttpClient) { }

  getTokens(): Observable<any> {
    return this.http.get(`/api/v1alpha/realm/${realmIdPlaceholder}/tokens`);
  }

  revokeToken(tokenId: string) {
    return this.http.delete(`api/v1alpha/realm/${realmIdPlaceholder}/tokens/${tokenId}`);
  }
}
