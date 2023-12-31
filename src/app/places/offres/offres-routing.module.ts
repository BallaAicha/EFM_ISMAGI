import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffresPage } from './offres.page';

const routes: Routes = [
  {
    path: '',
    component: OffresPage
  },
  {
    path: 'new-offer',
    loadChildren: () => import('./new-offer/new-offer.module').then( m => m.NewOfferPageModule)
  },
  {
    path: 'edit-offer',
    loadChildren: () => import('./edit-offer/edit-offer.module').then( m => m.EditOfferPageModule)
  },
  {
    path: 'offer-booking',
    loadChildren: () => import('./offer-booking/offer-booking.module').then( m => m.OfferBookingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffresPageRoutingModule {}
