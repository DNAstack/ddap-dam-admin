import { NgModule } from '@angular/core';

import { AdminSharedModule } from '../shared/shared.module';

import { UsersAndGroupsRoutingModule } from './users-and-groups-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    AdminSharedModule,
    UsersAndGroupsRoutingModule,
  ],
})
export class UsersAndGroupsModule {

}
