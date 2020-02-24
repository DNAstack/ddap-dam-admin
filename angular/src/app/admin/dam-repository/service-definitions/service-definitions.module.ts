import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { DamRepositorySharedModule } from '../shared/shared.module';

import { ServiceDefinitionAccessComponent } from './service-definition-access/service-definition-access.component';
import { ServiceDefinitionDetailComponent } from './service-definition-detail/service-definition-detail.component';
import { ServiceDefinitionFormComponent } from './service-definition-form/service-definition-form.component';
import { ServiceDefinitionListComponent } from './service-definition-list/service-definition-list.component';
import { ServiceDefinitionManageComponent } from './service-definition-manage/service-definition-manage.component';
import { ServiceDefinitionsRoutingModule } from './service-definitions-routing.module';
import { VariablesDialogComponent } from './variables-dialog/variables-dialog.component';

@NgModule({
  declarations: [
    ServiceDefinitionListComponent,
    ServiceDefinitionManageComponent,
    ServiceDefinitionDetailComponent,
    ServiceDefinitionFormComponent,
    VariablesDialogComponent,
    ServiceDefinitionAccessComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    ServiceDefinitionsRoutingModule,
    MatRadioModule,
  ],
  entryComponents: [VariablesDialogComponent],
})
export class ServiceDefinitionsModule { }
