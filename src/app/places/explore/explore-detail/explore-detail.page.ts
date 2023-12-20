import { Component, OnInit } from '@angular/core';
import {Place} from "../../place-model/place-model";
import {Subscription} from "rxjs";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaceService} from "../../../services/place.service";
import {BookingService} from "../../../services/booking.service";
import {AuthService} from "../../../auth/auth/auth.service";
import {MapModelComponent} from "../../../shared/map-model/map-model.component";
import {CreateBookingPage} from "../../mybookings/create-booking/create-booking.page";

@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail.page.html',
  styleUrls: ['./explore-detail.page.scss'],
})
export class ExploreDetailPage implements OnInit {
  place!: Place;
  isBookable = false;
  isLoading = false;
  private placeSub!: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlaceService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.place = place;
            this.isBookable = place.userId !== this.authService.userId;
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    }
                  }
                ]
              })
              .then((alertEl: { present: () => any; }) => alertEl.present());
          }
        );
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingPage,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking place...' })
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModelComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address
        }
      })
      .then(modalEl => {
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
