import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { RealmActionType, ViewControllerService } from 'ddap-common-lib';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { Identity, Profile } from '../../account/identity/identity.model';
import { IdentityService } from '../../account/identity/identity.service';
import { IdentityStore } from '../../account/identity/identity.store';
import { DamService } from '../../admin/dam-repository/dam.service';
import { AppConfigService } from '../app-config/app-config.service';
import { RealmService } from '../realm/realm.service';
import { UserDamInfoAccess } from '../user-dam-info-access.model';

const refreshRepeatTimeoutInMs = 600000;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  isSandbox = false;
  account: { profile?: Profile };
  userDamInfoAccess: UserDamInfoAccess;
  realm: string;
  loginPath: string;
  simplifiedView: boolean;
  groupName: string;

  readonly RealmActionType = RealmActionType;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private damService: DamService,
              private realmService: RealmService,
              private router: Router,
              public viewControllerService: ViewControllerService,
              public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    this.identityStore.state$
      .subscribe((identity: Identity) => {
        if (!identity) {
          return;
        }
        const { sandbox, account } = identity;
        this.isSandbox = sandbox;
        this.account = account;
      });

    this.determineAdminAccessForDam();

    this.simplifiedView = this.router.url.includes('dam/simple');

    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
      this.loginPath = `/api/v1alpha/realm/${this.realm}/identity/login`;
    });

    // Workaround to get fresh cookies
    this.periodicallyRefreshTokens()
      .subscribe();
  }

  isChildPage() {
    return !!this.activatedRoute.firstChild;
  }

  logout() {
    this.identityService.invalidateAccessTokens()
      .subscribe(() => {
        window.location.href = `${this.loginPath}`;
      });
  }

  realmActionConfirmed(dialogData) {
    if (dialogData) {
      if (dialogData.action === RealmActionType.edit) {
        this.changeRealmAndGoToLogin(dialogData.realm);
      } else if (dialogData.action === RealmActionType.delete) {
        this.deleteRealm(dialogData.realm);
      }
    }
  }

  toggleSimplifiedView() {
    this.simplifiedView = !this.simplifiedView;
  }

  private determineAdminAccessForDam() {
    this.damService.getDamInfoAndUserAccess()
      .subscribe((userDamInfoAccess: UserDamInfoAccess) => {
        this.userDamInfoAccess = userDamInfoAccess;
      });
  }

  private periodicallyRefreshTokens(): Observable<any> {
    return this.identityService.refreshAccessTokens()
      .pipe(
        repeatWhen(() => interval(refreshRepeatTimeoutInMs))
      );
  }

  private changeRealmAndGoToLogin(realm) {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `/api/v1alpha/realm/${realm}/identity/login?loginHint=${loginHint}`;
      });
  }

  private deleteRealm(realm) {
    if (realm !== 'master') {
      this.realmService.deleteRealm(realm).subscribe(() => {
        this.router.navigate(['/master']).then(() => window.location.reload());
      });
    }
  }

}
