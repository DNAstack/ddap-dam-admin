import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { QuickstartFormComponent } from './quickstart-form/quickstart-form.component';
import { QuickstartListComponent } from './quickstart-list/quickstart-list.component';
import { QuickstartManageComponent } from './quickstart-manage/quickstart-manage.component';
import { QuickstartRoutingModule } from './quickstart-routing.module';

@NgModule({
  declarations: [
    QuickstartListComponent,
    QuickstartManageComponent,
    QuickstartFormComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    QuickstartRoutingModule,
    MatRadioModule,
  ],
})
export class QuickstartModule { }
