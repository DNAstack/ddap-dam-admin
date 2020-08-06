import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupManageComponent } from './group-manage/group-manage.component';

export const routes: Routes = [
  { path: '', component: GroupListComponent },
  { path: ':entityId', component: GroupDetailComponent },
  { path: 'manage/add', pathMatch: 'full', component: GroupManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule { }
