import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisaTypeDetailComponent } from './visa-type-detail/visa-type-detail.component';
import { VisaTypeListComponent } from './visa-type-list/visa-type-list.component';
import { VisaTypeManageComponent } from './visa-type-manage/visa-type-manage.component';

export const routes: Routes = [
  { path: '', component: VisaTypeListComponent },
  { path: ':entityId', component: VisaTypeDetailComponent },
  { path: 'manage/add', pathMatch: 'full', component: VisaTypeManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisaTypesRoutingModule { }
