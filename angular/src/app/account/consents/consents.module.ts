import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AdminSharedModule } from '../../admin/shared/shared.module';

import { ConsentListComponent } from './consent-list/consent-list.component';
import { ConsentsRoutingModule } from './consents-routing.module';

@NgModule({
  declarations: [
    ConsentListComponent,
  ],
  imports: [
    AdminSharedModule,
    ConsentsRoutingModule,
    NgJsonEditorModule,
    MatListModule,
  ],
})
export class ConsentsModule {

}
