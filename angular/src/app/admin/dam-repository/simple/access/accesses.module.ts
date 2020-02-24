import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { AccessFormComponent } from './access-form/access-form.component';
import { AccessListComponent } from './access-list/access-list.component';
import { AccessManageComponent } from './access-manage/access-manage.component';
import { AccessesRoutingModule } from './accesses-routing.module';

@NgModule({
  declarations: [
    AccessListComponent,
    AccessManageComponent,
    AccessFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    AccessesRoutingModule,
  ],
})
export class AccessesModule { }
