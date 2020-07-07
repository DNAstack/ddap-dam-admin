import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DdapFormModule } from 'ddap-common-lib';

import { AdminSharedModule } from '../shared/shared.module';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserDetailComponent,
    UserListComponent,
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
