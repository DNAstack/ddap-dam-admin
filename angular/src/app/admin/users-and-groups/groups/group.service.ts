import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import IListGroupsResponse = scim.v2.IListGroupsResponse;
import { environment } from '../../../../environments/environment';
import { scim } from '../../../shared/proto/dam-service';
import IGroup = scim.v2.IGroup;
import IPatch = scim.v2.IPatch;

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getGroup(groupId: string, params = {}): Observable<IGroup> {
    return this.http.get<IGroup>(`${environment.damBaseUrl}/identity/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load group.`)
      );
  }

  getGroups(params = {}): Observable<IListGroupsResponse> {
    return this.http.get<IListGroupsResponse>(`${environment.damBaseUrl}/identity/scim/v2/${realmIdPlaceholder}/Groups`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load groups.`)
      );
  }

  createGroup(groupId: string, group: IGroup): Observable<IGroup> {
    group.schemas = ['urn:ietf:params:scim:schemas:core:2.0:Group'];
    return this.http.post<IGroup>(`${environment.damBaseUrl}/identity/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, group);
  }

  patchGroup(groupId: string, change: IPatch): Observable<IGroup> {
    return this.http.patch<IGroup>(`${environment.damBaseUrl}/identity/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, change);
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${environment.damBaseUrl}/identity/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`);
  }

}
