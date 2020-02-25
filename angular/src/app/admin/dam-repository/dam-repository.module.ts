import { NgModule } from '@angular/core';

import { LayoutComponent } from '../../shared/layout/layout.component';
import { SharedModule } from '../../shared/shared.module';

import { DamRepositoryRoutingModule } from './dam-repository-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    SharedModule,
    DamRepositoryRoutingModule,
  ],
})
export class DamRepositoryModule {

}
