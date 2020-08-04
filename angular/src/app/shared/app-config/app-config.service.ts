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
      .registerGroup({
        key: 'identity',
        name: 'Identity Management',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: true,
      })
      .registerGroup({
        key: 'user-admin',
        name: 'User Administration',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      })
      .registerGroup({
        key: 'simplified',
        name: 'Simplified Settings',
        collapsible: false,
        collapsibleByDefault: false,
        nonAdmin: false,
      }).registerGroup({
        key: 'advanced',
        name: 'Advanced Settings',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      });

    this.viewController
      .registerModule({
        key: 'identity-admin',
        name: 'My Identity',
        iconClasses: 'icon icon-identity',
        routerLink: 'account/identity',
        isApp: false,
        group: 'identity',
        nonAdmin: true,
      })
      .registerModule({
        key: 'identity-tokens',
        name: 'Sessions',
        iconClasses: 'icon icon-clients',
        routerLink: 'account/sessions',
        group: 'identity',
        isApp: false,
      })
      .registerModule({
        key: 'identity-consents',
        name: 'Consents',
        iconClasses: 'icon icon-passport',
        routerLink: 'account/consents',
        group: 'identity',
        isApp: false,
      })
      .registerModule({
        key: 'identity-auditlogs',
        name: 'Auditlogs',
        iconClasses: 'icon icon-rules',
        routerLink: 'account/auditlogs',
        group: 'identity',
        isApp: false,
      })
      .registerModule({
        key: 'admin-users',
        name: 'Users',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/users',
        isApp: false,
        group: 'user-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'simplified-admin-quickstart',
        name: 'Quickstart',
        iconClasses: 'icon icon-policies',
        routerLink: 'admin/dam/simple/quickstart',
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
        key: 'advanced-visa-types',
        name: 'Visa Types',
        iconClasses: 'icon icon-claims',
        routerLink: 'admin/dam/advanced/visa-types',
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
        name: 'Groups',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/dam/advanced/groups',
        group: 'advanced',
        isApp: false,
      });
  }

}
