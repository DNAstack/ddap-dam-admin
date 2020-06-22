import { NgModule } from '@angular/core';

import { DamRepositorySharedModule } from '../../admin/dam-repository/shared/shared.module';

import { TokensListComponent } from './tokens-list/tokens-list.component';
import { TokensRoutingModule } from './tokens-routing.module';

@NgModule({
  declarations: [
    TokensListComponent,
  ],
  imports: [
    DamRepositorySharedModule,
    TokensRoutingModule,
  ],
})
export class TokensModule {}
