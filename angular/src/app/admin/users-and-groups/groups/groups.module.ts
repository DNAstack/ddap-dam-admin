import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../dam-repository/shared/shared.module';

import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupManageComponent } from './group-manage/group-manage.component';
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupManageComponent,
    GroupDetailComponent,
    GroupFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    GroupsRoutingModule,
  ],
})
export class GroupsModule { }
