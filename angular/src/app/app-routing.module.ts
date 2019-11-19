import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { defaultRealm } from 'ddap-common-lib';

import { LayoutComponent } from './layout/layout.component';
import { RealmGuard } from './shared/realm.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `/${defaultRealm}` },
  {
    path: ':realmId',
    component: LayoutComponent,
    canActivate: [RealmGuard],
    children: [
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
