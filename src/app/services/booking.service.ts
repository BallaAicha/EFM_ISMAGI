import { Injectable } from '@angular/core';
import {BehaviorSubject, switchMap, take} from "rxjs";
import {Booking} from "../shared/map-model/booking-model";
import {map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }






  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    console.log('add booking');
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      guestNumber,
      placeImage,
      firstName,
      lastName,
      dateFrom,
      dateTo
    );
    return this.http.post<{name: string}>('https://ionic-angular-dfb26-default-rtdb.firebaseio.com/bookings.json', {...newBooking, id: null})
      .pipe(
        switchMap(resData => {
          // @ts-ignore
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          // @ts-ignore
          this._bookings.next(bookings.concat(newBooking));
        })
      );


  }

  fetchBookings() {
    console.log('Fetching bookings for userId:', this.authService.userId);

    return this.http.get<{ [key: string]: Booking }>(
      `https://ionic-angular-dfb26-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    ).pipe(
      map(resData => {
        console.log('Raw Data from Server:', resData);

        const bookings = [];
        // @ts-ignore
        for (const key in resData) {
          // @ts-ignore
          if (resData.hasOwnProperty(key)) {
            // @ts-ignore
            bookings.push(
              new Booking(
                key,
                resData[key].placeId,
                resData[key].userId,
                resData[key].placeTitle,
                resData[key].guestNumber,
                resData[key].placeImage,
                resData[key].firstName,
                resData[key].lastName,
                new Date(resData[key].dateFrom),
                new Date(resData[key].dateTo)
              )
            );
          }
        }
        console.log('Processed Bookings:', bookings);
        return bookings;
      }),
      tap(bookings => {
        console.log('Updating Bookings Subject:', bookings);
        this._bookings.next(bookings);
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(`https://ionic-angular-dfb26-default-rtdb.firebaseio.com/bookings/${bookingId}.json`)
      //il faut activer le indexOn dans les règles dans firebase pour pouvoir utiliser la requête ci-dessous car on utilise l'ordre orderBy="userId" dans la requête ci-dessous.
      //indexOn: ["userId"] permet de dire à firebase de créer un index sur le champ userId pour pouvoir le consulter.
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          // @ts-ignore
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      );
  }


  constructor(
    private http: HttpClient,
    private authService: AuthService) {}
}
