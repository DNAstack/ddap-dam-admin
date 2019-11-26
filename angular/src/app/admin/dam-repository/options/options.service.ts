import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OptionService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  public get(params = {}): Observable<any[]> {
    return this.http.get<any>(`${environment.damApiUrl}/${realmIdPlaceholder}/config`,
      {params}
    ).pipe(
      pluck('options')
    );
  }

  public update(newOptions: object): Observable<any> {
    return this.http.put(`${environment.damApiUrl}/${realmIdPlaceholder}/config/options`,
      {item: newOptions}
    );
  }

}
