import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'simple',
    children: [
      {
        path: 'quickstart',
        loadChildren: () => import('./simplify-settings/quickstart/quickstart.module')
          .then(mod => mod.QuickstartModule),
      },
    ],
  },
  {
    path: 'advanced',
    children: [
      {
        path: 'visa-types',
        loadChildren: () => import('./advanced-settings/visa-types/visa-types.module')
          .then(mod => mod.VisaTypesModule),
      },
      {
        path: 'options',
        loadChildren: () => import('./advanced-settings/options/options.module')
          .then(mod => mod.OptionsModule),
      },
      {
        path: 'service-definitions',
        loadChildren: () => import('./advanced-settings/service-definitions/service-definitions.module')
          .then(mod => mod.ServiceDefinitionsModule),
      },
    ],
  },
  {
    path: 'resource-settings',
    children: [
      {
        path: 'policies',
        loadChildren: () => import('./resource-settings/access-policies/access-policies.module')
          .then(mod => mod.AccessPoliciesModule),
      },
      {
        path: 'resources',
        loadChildren: () => import('./resource-settings/resources/resources.module')
          .then(mod => mod.ResourcesModule),
      },
      {
        path: 'personas',
        loadChildren: () => import('./resource-settings/personas/personas.module')
          .then(mod => mod.PersonasModule),
      },
    ],
  },
  {
    path: 'trust-config',
    children: [
      {
        path: 'clients',
        loadChildren: () => import('./trust-config/client-applications/client-applications.module')
          .then(mod => mod.ClientApplicationsModule),
      },
      {
        path: 'issuers',
        loadChildren: () => import('./trust-config/passport-issuers/passport-issuers.module')
          .then(mod => mod.PassportIssuersModule),
      },
      {
        path: 'sources',
        loadChildren: () => import('./trust-config/visa-sources/visa-sources.module')
          .then(mod => mod.VisaSourcesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamRepositoryRoutingModule { }
