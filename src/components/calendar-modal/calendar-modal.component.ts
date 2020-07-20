import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ViewController, NavParams } from 'ionic-angular'
import { ThrowStmt } from '@angular/compiler';

/**
 * Generated class for the CalendarModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'calendar-modal',
  templateUrl: 'calendar-modal.html'
})
export class CalendarModalComponent {
  constructor(private datePipe: DatePipe, private viewController: ViewController, private navParams: NavParams) {
  }
  
  date: number = Date.now();
  currentDate = new Date();
  selectedDate;
  weeks = [];
  show: boolean;
  namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  minDate = null;
  maxDate = null;
  errorMessage = null;
  yearArray = [];
  currentYear;

  ngOnInit() {
      this.currentYear = this.currentDate.getFullYear();
      this.yearArray = this.setUpYear();
      if (this.navParams.get('minDate') != null) {
        this.minDate = this.navParams.get('minDate'); 
      }
      if (this.navParams.get('maxDate') != null) {
        this.maxDate = this.navParams.get('maxDate') 
      }
      this.generateCalendar();
    }

    setUpYear(){
      let today = new Date().getFullYear();
      let yearBefore = 50;
      let yearAfter = 8

      let min = today - yearBefore;
      let max = today + yearAfter;

      let year = [];

      while (min <= max) {
        year.push(min);
        min = min+1;
      }
      return year;
    }

    changeYear(year){
      this.currentDate = new Date(this.currentDate.setFullYear(year));
      this.generateCalendar();
    }
    dismiss() {
      this.errorMessage = null;
      this.selectedDate = null;
      this.viewController.dismiss({date: this.selectedDate, message: this.errorMessage})
    }
    private generateCalendar(): void {
      const dates = this.fillDates(this.currentDate);
      const weeks = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }
      this.weeks = weeks;
    }

    private fillDates(date) {
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    
      const firstDayOfGrid = new Date(date.getFullYear(), date.getMonth(), 0 - firstOfMonth);
      var x = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const lastDayOfGrid  = new Date(x.setDate(x.getDate() - lastOfMonth + 5));
     
      let start = new Date(firstDayOfGrid);
      let end = new Date(lastDayOfGrid)
      let datesArray = [];
      while (start <= end) {
        datesArray.push({
          today: this.isToday(start),
          selected: this.isSelected(start),
          mDate: start,
        });
        start = new Date(start.setDate(start.getDate() + 1));
      }
      return datesArray;
    }

    private isToday(date): boolean {
      var today = new Date();
      if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()){
        return true;
      } else {
        return false;
      }
    }

    private isSelected(date): boolean {
      return this.selectedDate ===  this.datePipe.transform(date, 'dd-MM-dyyy');
    }

    public prevMonth(): void {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
      this.generateCalendar();
    }
    
    public nextMonth(): void {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
      this.generateCalendar();
    }
    
    public selectDate(date) {
      this.selectedDate =  this.datePipe.transform(date.mDate, 'yyyy-MM-dd')
      if (this.minDate != null || this.maxDate != null ) {
        if (this.selectedDate < this.minDate){
          this.errorMessage = "ERROR: You have selected date before the Minimum Date"
          this.selectedDate = null;
          this.viewController.dismiss({date: this.selectedDate, message: this.errorMessage});
        } else if (this.selectedDate > this.maxDate) {
          this.errorMessage = "ERROR: You have selected date before the Maximum Date"
          this.selectedDate = null;
          this.viewController.dismiss({date: this.selectedDate, message: this.errorMessage});
        } else {
          this.goBackToHome(date);
        }
      } else {
        this.goBackToHome(date);
      }
    }

    goBackToHome(date){
      this.selectedDate =  this.datePipe.transform(date.mDate, 'dd-MM-yyyy')
      this.generateCalendar();
      this.show = !this.show;
      this.viewController.dismiss({date: this.selectedDate, message: this.errorMessage});
    }
}
