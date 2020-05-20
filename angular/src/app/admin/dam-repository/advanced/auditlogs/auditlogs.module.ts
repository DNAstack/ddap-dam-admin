import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MenuModule } from 'ddap-common-lib';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { AuditlogsListComponent } from './audilogs-list/auditlogs-list.component';
import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogsRoutingModule } from './auditlogs-routing.module';

@NgModule({
  declarations: [
    AuditlogsListComponent,
    AuditlogDetailComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    AuditlogsRoutingModule,
    MenuModule,
    MatPaginatorModule,
  ],
})

export class AuditlogsModule {}
