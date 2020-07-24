import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogListComponent } from './auditlog-list/auditlog-list.component';

export const routes: Routes = [
  { path: '', component: AuditlogListComponent},
  { path: ':auditlogId', component: AuditlogDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuditlogsRoutingModule {}
