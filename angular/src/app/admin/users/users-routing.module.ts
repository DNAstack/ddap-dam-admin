import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAuditlogDetailComponent } from './user-auditlog-detail/user-auditlog-detail.component';
import { UserAuditlogListComponent } from './user-auditlog-list/user-auditlog-list.component';
import { UserConsentListComponent } from './user-consent-list/user-consent-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserSessionListComponent } from './user-session-list/user-session-list.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':userId', component: UserDetailComponent },
  { path: ':userId/consents', component: UserConsentListComponent },
  { path: ':userId/sessions', component: UserSessionListComponent },
  { path: ':userId/auditlogs', component: UserAuditlogListComponent },
  { path: ':userId/auditlogs/:auditlogId', component: UserAuditlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
