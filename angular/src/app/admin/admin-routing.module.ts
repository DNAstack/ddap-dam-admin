import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dam',
    loadChildren: () => import('./dam-repository/dam-repository.module')
      .then(mod => mod.DamRepositoryModule),
  },
  {
    path: 'users-and-groups',
    loadChildren: () => import('./users-and-groups/users-and-groups.module')
      .then(mod => mod.UsersAndGroupsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
