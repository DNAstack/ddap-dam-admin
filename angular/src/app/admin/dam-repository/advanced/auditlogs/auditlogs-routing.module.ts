import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditlogsListComponent } from './audilogs-list/auditlogs-list.component';
import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';

export const routes: Routes = [
  { path: '', component: AuditlogsListComponent},
  { path: ':auditlogId', component: AuditlogDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuditlogsRoutingModule {}
