import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { TokenListComponent } from './token-list/token-list.component';
import { TokensRoutingModule } from './tokens-routing.module';

@NgModule({
  declarations: [
    TokenListComponent,
  ],
  imports: [
    SharedModule,
    TokensRoutingModule,
  ],
})
export class TokensModule {}
