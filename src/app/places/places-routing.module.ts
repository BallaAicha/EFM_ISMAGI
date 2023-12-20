import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children:[
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)

          },
          {

            path: ':placeId',
            loadChildren: () => import('./place-detail/place-detail.module').then( m => m.PlaceDetailPageModule)
          }
        ]
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadChildren: () => import('./offres/offres.module').then( m => m.OffresPageModule)
          },
          {
            path: 'new-offer',
            loadChildren: () => import('./offres/new-offer/new-offer.module').then( m => m.NewOfferPageModule)
          },
          {
            path: 'edit-offer/:placeId',
            loadChildren: () => import('./offres/edit-offer/edit-offer.module').then( m => m.EditOfferPageModule)
          },
          {
            path: 'offer-booking/:placeId',
            loadChildren: () => import('./offres/offer-booking/offer-booking.module').then( m => m.OfferBookingPageModule)
          },
          {
            path: ':placeId',
            loadChildren: () => import('./offres/offer-booking/offer-booking.module').then( m => m.OfferBookingPageModule)
          }
        ]
      },

      {
        path: 'mybookings',
        children: [
          {
            path: '',
            loadChildren: () => import('./mybookings/mybookings.module').then( m => m.MybookingsPageModule)
          },

        ]
      },

      {
        path: 'favoris',
        children: [
          {
            path: '',
            loadChildren: () => import('./favoris/favoris.module').then( m => m.FavorisPageModule)
          },

        ]
      },
      //pour messages
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
          },

        ]
      },

      {
        path: 'profil',
        children: [
          {
            path: '',
            loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
          },

        ]
      },

      {
        path: 'travel',
        children: [
          {
            path: '',
            loadChildren: () => import('./travel/travel.module').then( m => m.TravelPageModule)
          },

        ]
      },


      {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
      }
    ]
  },

    {
      path: '',
      redirectTo: '/places/tabs/discover',
      pathMatch: 'full'
    },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}




