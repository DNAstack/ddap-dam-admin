import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'advanced',
    children: [
      {
        path: 'access-policies',
        loadChildren: () => import('./access-policies/access-policies.module')
          .then(mod => mod.AccessPoliciesModule),
      },
      {
        path: 'claim-definitions',
        loadChildren: () => import('./claim-definitions/claim-definitions.module')
          .then(mod => mod.ClaimDefinitionsModule),
      },
      {
        path: 'client-applications',
        loadChildren: () => import('./client-applications/client-applications.module')
          .then(mod => mod.ClientApplicationsModule),
      },
      {
        path: 'options',
        loadChildren: () => import('./options/options.module')
          .then(mod => mod.OptionsModule),
      },
      {
        path: 'passport-issuers',
        loadChildren: () => import('./passport-issuers/passport-issuers.module')
          .then(mod => mod.PassportIssuersModule),
      },
      {
        path: 'resources',
        loadChildren: () => import('./resources/resources.module')
          .then(mod => mod.ResourcesModule),
      },
      {
        path: 'service-definitions',
        loadChildren: () => import('./service-definitions/service-definitions.module')
          .then(mod => mod.ServiceDefinitionsModule),
      },
      {
        path: 'test-personas',
        loadChildren: () => import('./personas/personas.module')
          .then(mod => mod.PersonasModule),
      },
      {
        path: 'trusted-sources',
        loadChildren: () => import('./trusted-sources/trusted-sources.module')
          .then(mod => mod.TrustedSourcesModule),
      },
      {
        path: 'whitelists',
        loadChildren: () => import('./whitelists/whitelists.module')
          .then(mod => mod.WhitelistsModule),
      },
      {
        path: 'tokens',
        loadChildren: () => import('./tokens/tokens.module')
          .then(mod => mod.TokensModule),
      },
    ],
  },
  {
    path: 'simple',
    children: [
      {
        path: 'access-policies',
        loadChildren: () => import('./access-policies/access-policies.module')
          .then(mod => mod.AccessPoliciesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamRepositoryRoutingModule { }
