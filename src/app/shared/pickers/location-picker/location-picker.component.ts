import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import { MapModelComponent } from "../../map-model/map-model.component";
import { HttpClient } from "@angular/common/http";
import { Geolocation } from '@capacitor/geolocation';


import {Capacitor} from "@capacitor/core";
import {Coordinates, PlaceLocation} from "../../../places/place-model/location-model";

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent {
  latitude!: number;
  longitude!: number;
  cityName!: string;
  selectedLocationImage!: string;//variable pour l'image de la carte statique
  isLoading = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();//on crée un événement locationPick de type PlaceLocation pour récupérer les coordonnées de la carte
  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController

  ) {}



  onPickLocation() {
    this.actionSheetCtrl.create(
      {
        header: 'Veuillez choisir',
        buttons: [
          {
            text: 'Localisation actuelle',
            handler: () => {
              this.locateUser();
            }
          },
          {
            text: 'Choisir sur la carte',
            handler: () => {
              this.openMap();
            }
          },
          {
            text: 'Annuler',
            role: 'cancel'
          }
        ]
      }
    ).then(actionSheetEl => {
      actionSheetEl.present();
    });



  }
  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {//on vérifie si le plugin Geolocation est disponible
      this.showErrorAlert();//on affiche une alerte d'erreur si le plugin n'est pas disponible
      return;//on sort de la fonction locateUser
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition()//on récupère la position actuelle de l'utilisateur
      .then(geoPosition => {//on récupère la position actuelle de l'utilisateur
        const coordinates: Coordinates = {//on crée un objet de type Coordinates qui contient les coordonnées de l'utilisateur
          lat: geoPosition.coords.latitude,//on récupère la latitude de l'utilisateur
          lng: geoPosition.coords.longitude,//on récupère la longitude de l'utilisateur
        };
        console.log('Current Coordinates:', coordinates);
        //afficher le nom de la ville
        this.getAddress(coordinates.lat, coordinates.lng);
        this.createPlace(coordinates.lat, coordinates.lng);//on crée un lieu à partir des coordonnées de l'utilisateur
        const pickedLocation: PlaceLocation = {//on crée un objet de type PlaceLocation qui contient les coordonnées de la carte
          lat: coordinates.lat,//on récupère les coordonnées de la carte
          lng: coordinates.lng,
          address: null,//on initialise l'adresse à null
          staticMapImageUrl: null//on initialise l'image de la carte statique à null
        };
        // Mettez à jour l'image de la carte statique pour la localisation actuelle
        const zoom = 15; // ou une valeur appropriée
        pickedLocation.staticMapImageUrl = this.getMapImage(
          coordinates.lat,
          coordinates.lng,
          zoom,

        );

        this.selectedLocationImage = pickedLocation.staticMapImageUrl;//on affecte l'image de la carte statique à la variable selectedLocationImage
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);//on émet l'événement locationPick qui contient les coordonnées de la carte
      })
  .catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private openMap() {
    this.modalCtrl
      .create({
        component: MapModelComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {//si modalData.data est null cad si on a pas cliqué sur la carte
            return;//on sort de la fonction onPickLocation sinon on continue pour afficher la carte
          }
          const pickedLocation: PlaceLocation = {//on crée un objet de type PlaceLocation qui contient les coordonnées de la carte
            lat: modalData.data.lat,//on récupère les coordonnées de la carte
            lng: modalData.data.lng,
            address: null,//on initialise l'adresse à null
            staticMapImageUrl: null//on initialise l'image de la carte statique à null
          };
          this.isLoading = true;
          this.getAddress(modalData.data.lat, modalData.data.lng);
          this.latitude = modalData.data.lat;
          this.longitude = modalData.data.lng;
          // Affiche la longitude et la latitude
          this.getCurrentPosition();
          this.printCurrentPosition();

          // Mettez à jour l'image de la carte statique
          const zoom = 15; // ou une valeur appropriée
          pickedLocation.staticMapImageUrl = this.getMapImage(
            modalData.data.lat,
            modalData.data.lng,
            zoom,

          );

          this.selectedLocationImage = pickedLocation.staticMapImageUrl;//on affecte l'image de la carte statique à la variable selectedLocationImage
          this.isLoading = false;
          this.locationPick.emit(pickedLocation);//on émet l'événement locationPick qui contient les coordonnées de la carte
        });
        modalEl.present();
      });
  }
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  }

  printCurrentPosition() {
    console.log(`Current position: ${this.latitude} ${this.longitude}`);
  }

  async getAddress(latitude: number, longitude: number) {
    await new Promise(resolve => setTimeout(resolve, 1000));//on attend 1 seconde avant de faire la requête car sinon on a une erreur 429 Too Many Requests
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    const data = await response.json();//on récupère les données de la requête au format json
    this.cityName = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.suburb;
    console.log(`City name: ${this.cityName}`);
  }


  private getMapImage(lat: number, lng: number, zoom: number) {//fonction pour récupérer l'image de la carte statique à partir des coordonnées de la carte
    //on calcule les coordonnées x et y de la carte statique ce calcule signifie que l'on
    // divise la longitude par 360 et on multiplie par 2 puissance
    // zoom pour avoir les coordonnées x et y de la carte statique
    const x = Math.floor((lng + 180) / 360 * (1 << zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoom));

    return `https://{s}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`//on retourne l'url de la carte statique en remplaçant {s} par a cad on utilise le serveur a
      .replace('{s}', 'a');//on remplace {s} par a le s : signifie le serveur a cad on utilise le serveur a c'est le serveur par défaut de leaflet
  }


  private showErrorAlert() {

    this.alertCtrl.create({
      header: 'Impossible de vous localiser',
      message: 'Veuillez activer le GPS',
      buttons: ['D\'accord']
    }).then((alertEl: { present: () => any; }) => alertEl.present());
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {//on crée un objet de type PlaceLocation qui contient les coordonnées de la carte
      lat: lat,//on récupère les coordonnées de la carte
      lng: lng,
      address: null,//on initialise l'adresse à null
      staticMapImageUrl: null//on initialise l'image de la carte statique à null
    };
    this.locationPick.emit(pickedLocation);//on émet l'événement locationPick qui contient les coordonnées de la carte

  }

}
