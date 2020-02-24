import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TargetAdaptersService {

  constructor(private http: HttpClient) {
  }

  getTargetAdapters(): Observable<Object> {
    return this.http.get(
      `${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/dam/target-adapters`
    );
  }

}
