import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { defaultRealm, RealmGuard } from 'ddap-common-lib';

import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `/${defaultRealm}` },
  {
    path: ':realmId',
    component: LayoutComponent,
    canActivate: [RealmGuard],
    children: [
      {
        path: 'account',
        loadChildren: () => import('./account/account.module')
          .then(mod => mod.AccountModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module')
          .then(mod => mod.AdminModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
