import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {SharedModule} from "./shared/shared.module";

// @ts-ignore
const routes: Routes = [

  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full'
  },
  {
    path: 'places',
    loadChildren: () => import('./places/places.module').then( m => m.PlacesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'search-results',
    loadChildren: () => import('./search-results/search-results.module').then( m => m.SearchResultsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'offer-item',
    loadChildren: () => import('./places/offres/offer-item/offer-item.module').then(m => m.OfferItemPageModule)
  },

  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then( m => m.SharedModule)
  },
  {
    path: 'explore-detail',
    loadChildren: () => import('./places/explore/explore-detail/explore-detail.module').then(m => m.ExploreDetailPageModule)
  },
  {
    path: 'create-booking',
    loadChildren: () => import('./places/mybookings/create-booking/create-booking.module').then(m => m.CreateBookingPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
