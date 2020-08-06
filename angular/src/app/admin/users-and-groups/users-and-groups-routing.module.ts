import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(mod => mod.UsersModule),
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module')
      .then(mod => mod.GroupsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersAndGroupsRoutingModule { }
