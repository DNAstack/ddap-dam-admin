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
        path: 'visa-types',
        loadChildren: () => import('./advanced/visa-types/visa-types.module')
          .then(mod => mod.VisaTypesModule),
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
    ],
  },
  {
    path: 'simple',
    children: [
      {
        path: 'quickstart',
        loadChildren: () => import('./simple/quickstart/quickstart.module')
          .then(mod => mod.QuickstartModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamRepositoryRoutingModule { }
