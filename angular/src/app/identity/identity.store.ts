import { Injectable } from '@angular/core';
import { EntityModel, Store } from 'ddap-common-lib';
import { Observable, ReplaySubject } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { Account } from './account.model';
import { Identity } from './identity.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityStore extends Store<Identity> {

  constructor(private identityService: IdentityService) {
    super(null);
    this.init();
  }

  getLoginHintForPrimaryAccount(): Observable<string> {
    return this.state$
      .pipe(
        pluck('account'),
        map((account: any) => {
          const username = account.profile.username;
          const primaryAccount = account.connectedAccounts.find((connectedAccount: Account) => {
            return connectedAccount.profile.username === username;
          });
          return primaryAccount.loginHint;
        })
      );
  }

  private init(): void {
    this.identityService.getIdentity()
      .subscribe((identity: Identity) => {
        this.setState(identity);
      });
  }

}
