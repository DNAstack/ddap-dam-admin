import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { VisaSourcesDetailComponent } from './visa-sources-detail/visa-sources-detail.component';
import { VisaSourcesFormComponent } from './visa-sources-form/visa-sources-form.component';
import { VisaSourcesListComponent } from './visa-sources-list/visa-sources-list.component';
import { VisaSourcesManageComponent } from './visa-sources-manage/visa-sources-manage.component';
import { VisaSourcesRoutingModule } from './visa-sources-routing.module';

@NgModule({
  declarations: [
    VisaSourcesListComponent,
    VisaSourcesManageComponent,
    VisaSourcesDetailComponent,
    VisaSourcesFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    VisaSourcesRoutingModule,
  ],
})
export class VisaSourcesModule { }
