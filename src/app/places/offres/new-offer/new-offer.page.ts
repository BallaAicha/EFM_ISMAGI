import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoadingController} from "@ionic/angular";
import {PlaceService} from "../../../services/place.service";
import {Router} from "@angular/router";
import {PlaceLocation} from "../../place-model/location-model";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form!:FormGroup ;


  constructor(
    private loadingCtrl: LoadingController,
    private placesService: PlaceService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, { validators: [Validators.required] })
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });//patchValue : permet de mettre à jour une partie du formulaire
  }
  async onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating place...',
    });
    await loading.present();

    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.description,
      +this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      this.form.value.location
    ).subscribe(
      () => {
        loading.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      },
      (error) => {
        loading.dismiss();
        // Gérez l'erreur ici (affichage d'un message d'erreur, par exemple)
        console.error('Error adding place:', error);
      }
    );
  }

}
