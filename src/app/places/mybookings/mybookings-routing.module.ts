import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MybookingsPage } from './mybookings.page';

const routes: Routes = [
  {
    path: '',
    component: MybookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MybookingsPageRoutingModule {}
