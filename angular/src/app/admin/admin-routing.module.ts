import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dam',
    loadChildren: () => import('./dam-repository/dam-repository.module')
      .then(mod => mod.DamRepositoryModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(mod => mod.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
