import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'advanced',
    children: [
      {
        path: 'access-policies',
        loadChildren: () => import('./advanced/access-policies/access-policies.module')
          .then(mod => mod.AccessPoliciesModule),
      },
      {
        path: 'claim-definitions',
        loadChildren: () => import('./advanced/claim-definitions/claim-definitions.module')
          .then(mod => mod.ClaimDefinitionsModule),
      },
      {
        path: 'client-applications',
        loadChildren: () => import('./advanced/client-applications/client-applications.module')
          .then(mod => mod.ClientApplicationsModule),
      },
      {
        path: 'options',
        loadChildren: () => import('./advanced/options/options.module')
          .then(mod => mod.OptionsModule),
      },
      {
        path: 'passport-issuers',
        loadChildren: () => import('./advanced/passport-issuers/passport-issuers.module')
          .then(mod => mod.PassportIssuersModule),
      },
      {
        path: 'resources',
        loadChildren: () => import('./advanced/resources/resources.module')
          .then(mod => mod.ResourcesModule),
      },
      {
        path: 'service-definitions',
        loadChildren: () => import('./advanced/service-definitions/service-definitions.module')
          .then(mod => mod.ServiceDefinitionsModule),
      },
      {
        path: 'test-personas',
        loadChildren: () => import('./advanced/personas/personas.module')
          .then(mod => mod.PersonasModule),
      },
      {
        path: 'trusted-sources',
        loadChildren: () => import('./advanced/trusted-sources/trusted-sources.module')
          .then(mod => mod.TrustedSourcesModule),
      },
      {
        path: 'whitelists',
        loadChildren: () => import('./advanced/whitelists/whitelists.module')
          .then(mod => mod.WhitelistsModule),
      },
      {
        path: 'tokens',
        loadChildren: () => import('./advanced/tokens/tokens.module')
          .then(mod => mod.TokensModule),
      },
      {
        path: 'auditlogs',
        loadChildren: () => import('./advanced/auditlogs/auditlogs.module')
          .then(mod => mod.AuditlogsModule),
      },
    ],
  },
  {
    path: 'simple',
    children: [
      {
        path: 'access',
        loadChildren: () => import('./simple/access/accesses.module')
          .then(mod => mod.AccessesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamRepositoryRoutingModule { }
