import { Injectable } from '@angular/core';

import {BehaviorSubject, switchMap, take} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Place} from "../places/place-model/place-model";
import {HttpClient} from "@angular/common/http";
import {PlaceLocation} from "../places/place-model/location-model";
import {AuthService} from "../auth/auth/auth.service";



@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private _places = new BehaviorSubject<Place[]>([]);
  get places() {return this._places.asObservable();}

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }
  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation

  ) {
    let generatedId: string;//on déclare une variable pour stocker l'ID généré par le serveur.
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );
// Envoie une requête HTTP POST au serveur avec les détails du nouveau lieu.
    return this.http
      .post<{ name: string }>(

        'https://ionic-angular-dfb26-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(

        switchMap(resData => {
          console.log(resData);
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );

  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: Place }>(
        'https://ionic-angular-dfb26-default-rtdb.firebaseio.com/offered-places.json'
      ).pipe(
        map(resData => {

          const places = [];
          for (const key in resData) {
            console.log(key);
            //cette key est l'ID du lieu
            // @ts-ignore
            if (resData['hasOwnProperty'](key)) {
              // @ts-ignore
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  // @ts-ignore
                  new Date(resData[key].availableFrom),
                  // @ts-ignore
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location


                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap((places: Place[]) => {
          this._places.next(places);
        })
      );
  }
  getPlace(id: string | null) {
    return this.http
      .get<Place>(
        `https://ionic-angular-dfb26-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id!,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return this.places;
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(//on envoie une requête HTTP PUT au serveur avec les nouvelles données du lieu.
          `https://ionic-angular-dfb26-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {//tap permet d'exécuter du code sans modifier l'observable.
        this._places.next(updatedPlaces);//on met à jour la liste des lieux.
      })
    );
  }





}
