import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TokenListComponent } from './token-list/token-list.component';


export const routes: Routes = [
  { path: '', component: TokenListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokensRoutingModule { }
