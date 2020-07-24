import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AdminSharedModule } from '../../admin/shared/shared.module';

import { SessionListComponent } from './session-list/session-list.component';
import { SessionsRoutingModule } from './sessions-routing.module';

@NgModule({
  declarations: [
    SessionListComponent,
  ],
  imports: [
    AdminSharedModule,
    SessionsRoutingModule,
    NgJsonEditorModule,
    MatTooltipModule,
  ],
})
export class SessionsModule {

}
