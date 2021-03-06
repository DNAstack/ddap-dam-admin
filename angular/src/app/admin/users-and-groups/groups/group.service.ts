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
    return this.http.get<IGroup>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load group.`, true)
      );
  }

  getGroups(params = {}): Observable<IListGroupsResponse> {
    return this.http.get<IListGroupsResponse>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Groups`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load groups.`, true)
      );
  }

  createGroup(groupId: string, group: IGroup): Observable<IGroup> {
    group.schemas = ['urn:ietf:params:scim:schemas:core:2.0:Group'];
    return this.http.post<IGroup>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, group)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  patchGroup(groupId: string, change: IPatch): Observable<IGroup> {
    return this.http.patch<IGroup>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`, change)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Groups/${groupId}`)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

}
