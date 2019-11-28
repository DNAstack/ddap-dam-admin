import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AdminSharedModule } from '../../shared/shared.module';

import { ConditionFormComponent } from './condition-form/condition-form.component';
import { EntityManageFormComponent } from './entity-manage-form/entity-manage-form.component';
import {
  EntityRemovalConfirmationDialogComponent
} from './entity-removal-confirmation-dialog/entity-removal-confirmation-dialog.component';
import { PersonasAccessTableComponent } from './personas-access-table/personas-access-table.component';


@NgModule({
  declarations: [
    ConditionFormComponent,
    EntityManageFormComponent,
    EntityRemovalConfirmationDialogComponent,
    PersonasAccessTableComponent,
  ],
  imports: [
    AdminSharedModule,
    MatButtonToggleModule,
  ],
  exports: [
    AdminSharedModule,

    ConditionFormComponent,
    EntityManageFormComponent,
    EntityRemovalConfirmationDialogComponent,
    PersonasAccessTableComponent,
  ],
  entryComponents: [
    EntityRemovalConfirmationDialogComponent,
  ],
})
export class DamRepositorySharedModule { }
