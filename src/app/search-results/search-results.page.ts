// search-results.page.ts

import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Place } from "../places/place-model/place-model";
import { PlaceService } from "../services/place.service";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  searchTitle: string = '';
  searchResults: Place[] = [];
  @Input() searchQuery: string = '';

  constructor(
    private placeservice: PlaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTitle = params['title'];

      // Assurez-vous que places est initialisé en appelant fetchPlaces
      this.placeservice.fetchPlaces().subscribe((places: Place[]) => {
        this.searchResults = this.filterResultsByTitle(this.searchTitle, places);



      });
    });
  }

  filterResultsByTitle(title: string, places: Place[]): Place[] {
    const results: Place[] = [];
    for (const place of places) {
      if (place.title.toLowerCase().includes(title.toLowerCase())) {
        results.push(place);


      }

    }
    return results;
  }
}
