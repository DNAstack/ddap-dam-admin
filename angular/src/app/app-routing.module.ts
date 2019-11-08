import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { defaultRealm } from 'ddap-common-lib';

import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `/${defaultRealm}` },
  {
    path: ':realmId',
    component: LayoutComponent,
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
