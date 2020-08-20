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
        name: 'My Profile & Activity',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: true,
      })
      .registerGroup({
        key: 'user-admin',
        name: 'Users and Groups',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      })
      .registerGroup({
        key: 'resource-settings',
        name: 'Resource Settings',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      })
      .registerGroup({
        key: 'trust-config',
        name: 'Trust Configuration',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      })
      .registerGroup({
        key: 'advanced',
        name: 'Advanced Settings',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      });

    this.viewController
      // My Profile & Activity
      .registerModule({
        key: 'identity-admin',
        name: 'Profile',
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
        name: 'Remembered Consents',
        iconClasses: 'icon icon-passport',
        routerLink: 'account/consents',
        group: 'identity',
        isApp: false,
      })
      .registerModule({
        key: 'identity-auditlogs',
        name: 'Audit Logs',
        iconClasses: 'icon icon-rules',
        routerLink: 'account/auditlogs',
        group: 'identity',
        isApp: false,
      })
      // Users and Groups
      .registerModule({
        key: 'admin-users',
        name: 'Users',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/users-and-groups/users',
        isApp: false,
        group: 'user-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'admin-groups',
        name: 'Groups',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/users-and-groups/groups',
        group: 'user-admin',
        isApp: false,
        nonAdmin: false,
      })
      // FIXME: unable to put this in between of groups
      // Quickstart
      .registerModule({
        key: 'simplified-admin-quickstart',
        name: 'Add Data Quickstart',
        iconClasses: 'icon icon-policies',
        routerLink: 'admin/dam/simple/quickstart',
        group: null,
        isApp: false,
        nonAdmin: false,
      })
      // Resource Settings
      .registerModule({
        key: 'resource-settings-data',
        name: 'Data Resources',
        iconClasses: 'icon icon-resource',
        routerLink: 'admin/dam/resource-settings/resources',
        group: 'resource-settings',
        isApp: false,
      })
      .registerModule({
        key: 'resource-settings-policies',
        name: 'Data Access Policies',
        iconClasses: 'icon icon-policies',
        routerLink: 'admin/dam/resource-settings/policies',
        group: 'resource-settings',
        isApp: false,
      })
      .registerModule({
        key: 'resource-settings-personas',
        name: 'Test Personas',
        iconClasses: 'icon icon-tests',
        routerLink: 'admin/dam/resource-settings/personas',
        group: 'resource-settings',
        isApp: false,
      })
      // Trust Configuration
      .registerModule({
        key: 'trust-config-issuers',
        name: 'Passport & Visa Issuers',
        iconClasses: 'icon icon-passport',
        routerLink: 'admin/dam/trust-config/issuers',
        group: 'trust-config',
        isApp: false,
      })
      .registerModule({
        key: 'trust-config-sources',
        name: 'Visa Sources',
        iconClasses: 'icon icon-trusted',
        routerLink: 'admin/dam/trust-config/sources',
        group: 'trust-config',
        isApp: false,
      })
      .registerModule({
        key: 'trust-config-clients',
        name: 'Client Applications',
        iconClasses: 'icon icon-apps',
        routerLink: 'admin/dam/trust-config/clients',
        group: 'trust-config',
        isApp: false,
      })
      // Advanced
      .registerModule({
        key: 'advanced-options',
        name: 'Options',
        iconClasses: 'icon icon-settings',
        routerLink: 'admin/dam/advanced/options',
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
        key: 'advanced-service-definitions',
        name: 'Service Definitions',
        iconClasses: 'icon icon-clients',
        routerLink: 'admin/dam/advanced/service-definitions',
        group: 'advanced',
        isApp: false,
      });
  }

}
