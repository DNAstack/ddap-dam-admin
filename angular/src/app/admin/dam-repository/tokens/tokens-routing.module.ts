import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TokensListComponent } from './tokens-list/tokens-list.component';


export const routes: Routes = [
  { path: '', component: TokensListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokensRoutingModule { }
