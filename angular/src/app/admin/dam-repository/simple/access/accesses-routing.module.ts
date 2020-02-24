import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessListComponent } from './access-list/access-list.component';
import { AccessManageComponent } from './access-manage/access-manage.component';

export const routes: Routes = [
  { path: '', component: AccessListComponent },
  { path: 'manage/gcs', pathMatch: 'full', component: AccessManageComponent },
  { path: 'manage/bq', pathMatch: 'full', component: AccessManageComponent },
  { path: 'manage/beacon', pathMatch: 'full', component: AccessManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessesRoutingModule { }
