import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LoadingController, ModalController, Platform} from "@ionic/angular";
// @ts-ignore
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-model',
  templateUrl: './map-model.component.html',
  styleUrls: ['./map-model.component.scss'],
})
export class MapModelComponent  implements OnInit, AfterViewInit {

  @ViewChild('map', { static: false }) mapElementRef: ElementRef | undefined;
  private map: mapboxgl.Map | undefined;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Chargement de la carte...' })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
        }, 1000);
      });
  }

  ngAfterViewInit() {
    this.loadMapbox();
  }

  loadMapbox() {
    const mapEl = this.mapElementRef?.nativeElement;
    const mapHeight = this.platform.height();

    mapboxgl.accessToken = 'pk.eyJ1IjoibWJhY2tlYmFsbGEiLCJhIjoiY2xxODduMHlhMTY4NDJpc2c2ajEwM3piYSJ9.xh1LdDfqNF4bR4eF5Yjoig'; // Replace with your MapBox access token

    this.map = new mapboxgl.Map({//création de la carte
      container: mapEl,//conteneur de la carte
      style: 'mapbox://styles/mapbox/streets-v12', // style URL

      //coordonnées de la ville de Rabat
      center: [-6.841, 33.9716],//coordonnées de la ville de Rabat
      zoom: 9,
      //ajout d'un marker



    });
    //chargement de la carte sur un android
    this.map.on('load', () => {//permet de charger la carte
      this.map?.resize();//permet de redimensionner la carte


    });

    // Add a marker on click
    this.map.on('click', (event: { lngLat: { lat: any; lng: any; }; }) => {//on récupère les coordonnées de la carte
      const selectedCoords = {
        lat: event.lngLat.lat,//on récupère la latitude
        lng: event.lngLat.lng,//on récupère la longitude
      };
      this.modalCtrl.dismiss(selectedCoords);
    });

    this.renderer.setStyle(mapEl, 'height', `${mapHeight}px`);
    this.renderer.addClass(mapEl, 'visible');
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
