import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RealmStateService } from 'ddap-common-lib';
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class RealmGuard implements CanActivate {

  constructor(private realmStateService: RealmStateService) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const realm = _get(next, 'params.realmId');
    this.realmStateService.storeRealm(realm);
    return true;
  }

}
