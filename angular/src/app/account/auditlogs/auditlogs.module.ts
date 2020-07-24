import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MenuModule } from 'ddap-common-lib';

import { DamRepositorySharedModule } from '../../admin/dam-repository/shared/shared.module';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogListComponent } from './auditlog-list/auditlog-list.component';
import { AuditlogsRoutingModule } from './auditlogs-routing.module';

@NgModule({
  declarations: [
    AuditlogListComponent,
    AuditlogDetailComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    AuditlogsRoutingModule,
    MenuModule,
    MatPaginatorModule,
    NgJsonEditorModule,
  ],
})

export class AuditlogsModule {}
