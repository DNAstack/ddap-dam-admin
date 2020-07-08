import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsentListComponent } from './consent-list/consent-list.component';

export const routes: Routes = [
  { path: '', component: ConsentListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsentsRoutingModule {

}
