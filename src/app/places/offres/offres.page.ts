import { Component, OnInit } from '@angular/core';
import {IonItemSliding} from "@ionic/angular";
import {PlaceService} from "../../services/place.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Place} from "../place-model/place-model";

@Component({
  selector: 'app-offres',
  templateUrl: './offres.page.html',
  styleUrls: ['./offres.page.scss'],
})
export class OffresPage implements OnInit {

  offres!:Place[];
  private placesSub!: Subscription;//on va stocker le subscribe dans une variable pour pouvoir le détruire à la fin
  public isLoading: boolean=false

  constructor(private placeservice: PlaceService,private route:Router) { }

  ngOnInit() {
    //si on fait n subscribe, on doit le détruire à la fin
    this.placesSub = this.placeservice.places.subscribe(places => {
      this.offres = places;
    });
  }
  ionViewWillEnter() {//on va chercher les données à chaque fois qu'on entre dans la page
    this.isLoading = true;
    this.placeservice.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    //slidingItem.close();//pour fermer le bouton du sliding apres le retour
    //IonItemSliding est un objet qui contient la méthode clos
    slidingItem.close();//pour fermer le bouton du sliding apres le retour
    this.route.navigate(['places/tabs/offers/edit-offer', offerId]);
    console.log('Editing item', offerId);

  }

  ngOnDestroy(): void {//on détruit le subscribe à la fin
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
