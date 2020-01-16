import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserDamInfoAccess } from '../../layout/user-dam-info-access.model';

@Injectable({
  providedIn: 'root',
})
export class DamService {

  constructor(private http: HttpClient) {
  }

  getDamInfoAndUserAccess(params = {}): Observable<UserDamInfoAccess> {
    return this.http.get<UserDamInfoAccess>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/dam/info`, {params});
  }

}
