import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('../account/tokens/tokens.module')
          .then(mod => mod.TokensModule),
      },
      {
        path: 'auditlogs',
        loadChildren: () => import('../account/auditlogs/auditlogs.module')
          .then(mod => mod.AuditlogsModule),
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
