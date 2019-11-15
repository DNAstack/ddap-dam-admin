import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { DamService } from '../admin/dam-repository/dam.service';
import { IdentityService } from '../identity/identity.service';
import { IdentityStore } from '../identity/identity.store';
import { Profile } from '../identity/profile.model';

import { UserDamInfoAccess } from './user-dam-info-access.model';

const refreshRepeatTimeoutInMs = 600000;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  isSandbox = false;
  profile: Profile = null;
  userDamInfoAccess: UserDamInfoAccess;
  realm: string;
  loginPath: string;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private damService: DamService) {
  }

  ngOnInit() {
    this.identityStore.getIdentity()
      .subscribe(({ account, sandbox }) => {
        this.isSandbox = sandbox;
        this.profile = account.profile;
      });

    this.determineAdminAccessForDam();

    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
      this.loginPath = `/api/v1alpha/${this.realm}/identity/login`;
    });

    // Workaround to get fresh cookies
    this.periodicallyRefreshTokens()
      .subscribe();
  }

  isActivePanel(panelId: string): boolean {
    const adminRoute = this.activatedRoute.firstChild;
    if (adminRoute) {
      const childRoute = adminRoute.firstChild;
      const damPanelId = 'dam';
      return panelId === damPanelId && childRoute.routeConfig.path === damPanelId;
    }
    return false;
  }

  logout() {
    this.identityService.invalidateTokens()
      .subscribe(() => {
        window.location.href = `${this.loginPath}`;
      });
  }

  private determineAdminAccessForDam() {
    this.damService.getDamInfoAndUserAccess()
      .subscribe((userDamInfoAccess: UserDamInfoAccess) => {
        this.userDamInfoAccess = userDamInfoAccess;
      });
  }

  private periodicallyRefreshTokens(): Observable<any> {
    return this.identityService.refreshTokens()
      .pipe(
        repeatWhen(() => interval(refreshRepeatTimeoutInMs))
      );
  }

}
