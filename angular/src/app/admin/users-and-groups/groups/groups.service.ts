import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {

  constructor(private http: HttpClient) {
  }

  list(params = {}): Observable<any> {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/whitelists`, { params });
  }

  get(whitelistId: string, params = {}): Observable<any> {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/whitelists/${whitelistId}`, { params });
  }

  save(model: any): Observable<any> {
    return this.http.post(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/whitelists`,
      model
    );
  }

  remove(whitelistId: string): Observable<any> {
    return this.http.delete(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/whitelists/${whitelistId}`);
  }

}
