import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuickstartListComponent } from './quickstart-list/quickstart-list.component';
import { QuickstartManageComponent } from './quickstart-manage/quickstart-manage.component';

export const routes: Routes = [
  { path: '', component: QuickstartListComponent },
  { path: 'manage/:serviceTemplate', pathMatch: 'full', component: QuickstartManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickstartRoutingModule { }
