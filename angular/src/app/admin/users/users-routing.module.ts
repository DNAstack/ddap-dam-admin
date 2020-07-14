import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditlogsListComponent } from '../../account/auditlogs/audilogs-list/auditlogs-list.component';
import { AuditlogDetailComponent } from '../../account/auditlogs/auditlog-detail/auditlog-detail.component';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':entityId', component: UserDetailComponent },
  { path: ':entityId/auditlogs', component: AuditlogsListComponent },
  { path: ':entityId/auditlogs/:auditlogId', component: AuditlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
