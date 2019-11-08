import DamConfig = dam.v1.DamConfig;
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder, Store } from 'ddap-common-lib';
import _isEqual from 'lodash.isequal';
import { Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";

import { dam } from '../../../../shared/proto/dam-service';

import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class DamConfigStore extends Store<DamConfig> {

  constructor(private http: HttpClient) {
    super(DamConfig.create());
  }

  public set(): void {
    this.get()
      .subscribe((config) => {
        if (_isEqual(this.state, config)) {
          // Do not update state if there is no change
          return;
        }
        this.setState(config);
      });
  }

  private get(params = {}): Observable<DamConfig> {
    return this.http.get<DamConfig>(`${environment.damApiUrl}/${realmIdPlaceholder}/config`, { params })
      .pipe(
        map(DamConfig.create)
      );
  }

}
