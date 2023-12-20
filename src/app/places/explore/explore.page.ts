import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {Place} from "../place-model/place-model";
import {PlaceService} from "../../services/place.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  places!: Place[];
  private placesSub!: Subscription;
  searchQuery: string = '';
  constructor(
    private router: Router,
    private placeservice: PlaceService) {
  }

  ngOnInit() {
    this.placesSub = this.placeservice.places.subscribe((places: Place[]) => {
      this.places = places;
    });
  }

  ionViewWillEnter() {
    this.placeservice.fetchPlaces().subscribe(() => {

    });
    this.searchQuery = '';
  }

  filterPlaceByPrice() {
    this.places.sort((a, b) => {
      return a.price - b.price;
    });
  }

  RecherheParTitre() {
    const foundPlace = this.places.find(place => place.title.toLowerCase() === this.searchQuery.toLowerCase());

    if (foundPlace) {
      this.router.navigate(['/search-results'], {
        queryParams: {title: foundPlace.title},
      });
    } else {
      this.router.navigate(['/search-results'], {
        queryParams: {title: 'not found'},
      });
    }

  }


}

