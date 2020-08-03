import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { VisaTypeDetailComponent } from './visa-type-detail/visa-type-detail.component';
import { VisaTypeFormComponent } from './visa-type-form/visa-type-form.component';
import { VisaTypeListComponent } from './visa-type-list/visa-type-list.component';
import { VisaTypeManageComponent } from './visa-type-manage/visa-type-manage.component';
import { VisaTypesRoutingModule } from './visa-types-routing.module';

@NgModule({
  declarations: [
    VisaTypeListComponent,
    VisaTypeManageComponent,
    VisaTypeDetailComponent,
    VisaTypeFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    VisaTypesRoutingModule,
  ],
})
export class VisaTypesModule { }
