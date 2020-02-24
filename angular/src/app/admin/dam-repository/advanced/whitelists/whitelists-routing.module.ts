import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WhitelistDetailComponent } from './whitelist-detail/whitelist-detail.component';
import { WhitelistListComponent } from './whitelist-list/whitelist-list.component';
import { WhitelistManageComponent } from './whitelist-manage/whitelist-manage.component';

export const routes: Routes = [
  { path: '', component: WhitelistListComponent },
  { path: ':entityId', component: WhitelistDetailComponent },
  { path: 'manage/add', pathMatch: 'full', component: WhitelistManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhitelistsRoutingModule { }
