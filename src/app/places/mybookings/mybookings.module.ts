import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MybookingsPageRoutingModule } from './mybookings-routing.module';

import { MybookingsPage } from './mybookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MybookingsPageRoutingModule
  ],
  declarations: [MybookingsPage]
})
export class MybookingsPageModule {}
