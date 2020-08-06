import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisaSourcesDetailComponent } from './visa-sources-detail/visa-sources-detail.component';
import { VisaSourcesListComponent } from './visa-sources-list/visa-sources-list.component';
import { VisaSourcesManageComponent } from './visa-sources-manage/visa-sources-manage.component';

export const routes: Routes = [
  { path: '', component: VisaSourcesListComponent },
  { path: ':entityId', component: VisaSourcesDetailComponent },
  { path: 'manage/add', pathMatch: 'full', component: VisaSourcesManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisaSourcesRoutingModule { }
