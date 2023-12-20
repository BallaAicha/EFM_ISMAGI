import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Place} from "../../place-model/place-model";
import {NgForm} from "@angular/forms";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.page.html',
  styleUrls: ['./create-booking.page.scss'],
})
export class CreateBookingPage implements OnInit {
  @Input() selectedPlace!: Place;//on récupère le lieu sélectionné dans la page place-detail
  @Input() selectedMode!: 'select' | 'random';//on récupère le mode de réservation (select ou random) dans la page place-detail
  startDate!: string;
  endDate!: string;
  @ViewChild('f',{static:true}) form!: NgForm;//on récupère le formulaire de la page create-booking.page.html (f est l'identifiant du formulaire



  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    //renseigner la date de début et de fin de réservation par défaut
    const availableFrom = new Date(this.selectedPlace.availableFrom);//on récupère la date de début de réservation
    const availableTo = new Date(this.selectedPlace.availableTo);//on récupère la date de fin de réservation
    if (this.selectedMode === 'random') {
      //choisis comme date debut aujourd'hui + 1 jour et date fin aujourd'hui + 7 jours
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }


  }
  onBookPlace(form: any) {
    if (!form.valid || !this.datesValid()) {
      return;
    }
    //on ferme la page modale et on retourne les données saisies dans le formulaire

    this.modalCtrl.dismiss({bookingData:{
        firstName:form.value['first-name'],
        lastName:form.value['last-name'],
        guestNumber:+form.value['guest-number'],
        startDate:new Date(form.value['date-from']),
        endDate:new Date(form.value['date-to'])

      }},'confirm');//c'est les données qu'on va envoyer au modal
  }
  onCancel() {
    this.modalCtrl.dismiss(null,'cancel');
  }
  datesValid() {
    const startDate = new Date(this.form.value['date-from']);//on récupère la date de début de réservation
    const endDate = new Date(this.form.value['date-to']);//on récupère la date de fin de réservation
    return endDate > startDate;//si la date de fin est supérieure à la date de début, on retourne true

  }


}
