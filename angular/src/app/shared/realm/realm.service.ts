import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RealmService {
  constructor(private http: HttpClient) {}

  deleteRealm(realm: string) {
    return this.http.delete(`${environment.damApiUrl}/${realm}`);
  }
}
