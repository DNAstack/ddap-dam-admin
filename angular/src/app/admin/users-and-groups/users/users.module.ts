import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DdapFormModule } from 'ddap-common-lib';

import { AdminSharedModule } from '../../shared/shared.module';

import { UserAuditlogDetailComponent } from './user-auditlog-detail/user-auditlog-detail.component';
import { UserAuditlogListComponent } from './user-auditlog-list/user-auditlog-list.component';
import { UserConsentListComponent } from './user-consent-list/user-consent-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserSessionListComponent } from './user-session-list/user-session-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserDetailComponent,
    UserListComponent,
    UserConsentListComponent,
    UserSessionListComponent,
    UserAuditlogListComponent,
    UserAuditlogDetailComponent,
  ],
  imports: [
    AdminSharedModule,
    UsersRoutingModule,

    DdapFormModule,
    MatRadioModule,
    MatDialogModule,
  ],
})
export class UsersModule {

}
