import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    children: [
      {
        path: 'identity',
        loadChildren: () => import('./identity/identity.module')
          .then(mod => mod.IdentityModule),
      },
      {
        path: 'sessions',
        loadChildren: () => import('./sessions/sessions.module')
          .then(mod => mod.SessionsModule),
      },
      {
        path: 'consents',
        loadChildren: () => import('./consents/consents.module')
          .then(mod => mod.ConsentsModule),
      },
      {
        path: 'auditlogs',
        loadChildren: () => import('./auditlogs/auditlogs.module')
          .then(mod => mod.AuditlogsModule),
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
