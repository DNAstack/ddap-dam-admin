import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import IPatch = scim.v2.IPatch;
import IListUsersResponse = scim.v2.IListUsersResponse;
import IUser = scim.v2.IUser;
import { share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { scim } from '../proto/dam-service';
import IListGroupsResponse = scim.v2.IListGroupsResponse;

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // tslint:disable-next-line:max-line-length
  // See also https://github.com/GoogleCloudPlatform/healthcare-federated-access-services/blob/master/apis.md#users-tokens-and-consents-management-endpoints

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getLoggedInUser(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load User information.`, true),
        share()
      );
  }

  patchLoggedInUser(patchModel: IPatch): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`, patchModel)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  getUsers(params = {}): Observable<IListUsersResponse> {
    return this.http.get<IListUsersResponse>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Users`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load users.`, true)
      );
  }

  getUser(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load user.`, true)
      );
  }

  patchUser(userId: string, patchModel: IPatch): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`, patchModel)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${environment.damBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`)
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

}
