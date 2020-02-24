import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { WhitelistDetailComponent } from './whitelist-detail/whitelist-detail.component';
import { WhitelistFormComponent } from './whitelist-form/whitelist-form.component';
import { WhitelistListComponent } from './whitelist-list/whitelist-list.component';
import { WhitelistManageComponent } from './whitelist-manage/whitelist-manage.component';
import { WhitelistsRoutingModule } from './whitelists-routing.module';

@NgModule({
  declarations: [
    WhitelistListComponent,
    WhitelistManageComponent,
    WhitelistDetailComponent,
    WhitelistFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    WhitelistsRoutingModule,
  ],
})
export class WhitelistsModule { }
