import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CalendarModalComponent } from '../../components/calendar-modal/calendar-modal.component';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dateFromModal;
  minDate = null;
  maxDate = null;
  errorMessage = null;

  constructor(
    public navCtrl: NavController,public modalController: ModalController ) {
  }
  
  clear(){
    this.dateFromModal = null;
    this.errorMessage = null;
  }
  openModal() {
    this.clear();
    let modal = this.modalController.create(CalendarModalComponent, {minDate: this.minDate, maxDate: this.maxDate});
    modal.present();

    modal.onDidDismiss(data => {
      this.minDate = null;
      this.maxDate = null;
      this.dateFromModal = data.date;
      this.errorMessage = data.message;
    });
  }

  
 

}
