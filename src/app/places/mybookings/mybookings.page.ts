import { Component, OnInit } from '@angular/core';
import {IonItemSliding, LoadingController} from "@ionic/angular";
import {Booking} from "../../shared/map-model/booking-model";
import {Subscription} from "rxjs";
import {BookingService} from "../../services/booking.service";

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.page.html',
  styleUrls: ['./mybookings.page.scss'],
})
export class MybookingsPage implements OnInit {
  bookings!:Booking[];
  private bookingSub!: Subscription;
  public isLoading: boolean=false;

  constructor(
    private loadingCtrl: LoadingController,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.bookings = bookings;
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }
  onCancel(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    console.log('cancelling booking', bookingId);

  }
  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    //IonItemSliding : permet de fermer le sliding item après avoir cliqué sur le bouton cancel
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

}
