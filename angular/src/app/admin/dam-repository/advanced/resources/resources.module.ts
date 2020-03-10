import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { DamRepositorySharedModule } from '../../shared/shared.module';

import { PolicyVariableDialogComponent } from './policy-variable-dialog/policy-variable-dialog.component';
import { ResourceAccessComponent } from './resource-access/resource-access.component';
import { ResourceDetailComponent } from './resource-detail/resource-detail.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { ResourceViewFormComponent } from './resource-form/resource-view-form/resource-view-form.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceManageComponent } from './resource-manage/resource-manage.component';
import { ResourcesRoutingModule } from './resources-routing.module';

@NgModule({
  declarations: [
    ResourceListComponent,
    ResourceManageComponent,
    ResourceDetailComponent,
    ResourceFormComponent,
    ResourceViewFormComponent,
    ResourceAccessComponent,
    PolicyVariableDialogComponent,
  ],
    imports: [
        DamRepositorySharedModule,
        ResourcesRoutingModule,
        MatTabsModule,
    ],
  entryComponents: [
    PolicyVariableDialogComponent,
  ],
})
export class ResourcesModule { }
