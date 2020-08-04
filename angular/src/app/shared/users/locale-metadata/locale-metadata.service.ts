import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { LocaleMetadataModel } from './locale-metadata.model';

@Injectable({
  providedIn: 'root',
})
export class LocaleMetadataService {

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) {
  }

  getLocales(): Observable<LocaleMetadataModel> {
    return this.http.get<LocaleMetadataModel>(`${environment.damBaseUrl}/dam/v1alpha/${realmIdPlaceholder}/localeMetadata`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load locale metadata.`),
        share()
      );
  }

}
