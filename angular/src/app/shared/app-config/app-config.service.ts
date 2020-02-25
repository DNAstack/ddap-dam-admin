import { Injectable } from '@angular/core';
import { ViewControllerService } from 'ddap-common-lib';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  constructor(public viewController: ViewControllerService) {
    this.registerModules();
  }

  private registerModules() {
    this.viewController
      .registerModule({
        key: 'simple-access',
        name: 'Access',
        iconClasses: 'icon icon-policies',
        routerLink: 'admin/dam/simple/access',
        group: 'simplified',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-resources',
        name: 'Resources',
        iconClasses: 'icon icon-resource',
        routerLink: 'admin/dam/advanced/resources',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-access-policies',
        name: 'Access Policies',
        iconClasses: 'icon icon-policies',
        routerLink: 'admin/dam/advanced/access-policies',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-service-definitions',
        name: 'Service Definitions',
        iconClasses: 'icon icon-clients',
        routerLink: 'admin/dam/advanced/service-definitions',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-trusted-sources',
        name: 'Trusted Sources',
        iconClasses: 'icon icon-trusted',
        routerLink: 'admin/dam/advanced/trusted-sources',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-passport-issuers',
        name: 'Passport Issuers',
        iconClasses: 'icon icon-passport',
        routerLink: 'admin/dam/advanced/passport-issuers',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-claim-definitions',
        name: 'Claim Definitions',
        iconClasses: 'icon icon-claims',
        routerLink: 'admin/dam/advanced/claim-definitions',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-test-personas',
        name: 'Test Personas',
        iconClasses: 'icon icon-tests',
        routerLink: 'admin/dam/advanced/test-personas',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-client-applications',
        name: 'Client Applications',
        iconClasses: 'icon icon-apps',
        routerLink: 'admin/dam/advanced/client-applications',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-options',
        name: 'Options',
        iconClasses: 'icon icon-settings',
        routerLink: 'admin/dam/advanced/options',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-whitelists',
        name: 'Whitelists',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/dam/advanced/whitelists',
        group: 'advanced',
        isApp: false,
      })
      .registerModule({
        key: 'advanced-tokens',
        name: 'Tokens',
        iconClasses: 'icon icon-clients',
        routerLink: 'admin/dam/advanced/tokens',
        group: 'advanced',
        isApp: false,
      });
  }


}
