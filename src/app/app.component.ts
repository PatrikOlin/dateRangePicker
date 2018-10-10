import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public date = moment();
  public daysArray;
  public dateForm: FormGroup;
  public chosenDateInterval;
  title = 'dateRangePicker';

  constructor(private fb: FormBuilder) {
    this.initDateForm();
  }

  public initDateForm() {
    return this.dateForm = this.fb.group({ 
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    });
  }

  public ngOnInit() {
    this.daysArray = this.createCalendar(this.date);
  }

  public todayCheck(day) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  public createCalendar(month) {
    const firstDay = moment(month).startOf('M');
    const days = Array.apply(null, {length: month.daysInMonth()})
      .map(Number.call, Number)
      .map((n) => {
        return moment(firstDay).add(n, 'd');
      });
    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }
    console.log(days);
    return days;
  }

  public nextMonth() {
    this.date.add(1, 'M');
    this.daysArray = this.createCalendar(this.date);
  }

  public previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArray = this.createCalendar(this.date);
  }

  public isSelected(day) {
    if (!day) {
      return false;
    }
    const dateFrom = moment(this.dateForm.value.dateFrom, 'YYYY/MM/DD');
    const dateTo = moment(this.dateForm.value.dateTo, 'YYYY/MM/DD');
    if (this.dateForm.valid) {
      return dateFrom.isSameOrBefore(day) && dateTo.isSameOrAfter(day);
    }
    if (this.dateForm.get('dateFrom').valid) {
      return dateFrom.isSame(day);
    }
  }

  public pickDateRange() {
    if (!this.dateForm.valid) {
      return;
    }
    const dateFrom = this.dateForm.value.dateFrom;
    const dateTo = this.dateForm.value.dateTo;
    this.chosenDateInterval = `Valt datumspann = ${dateFrom} - ${dateTo}`;
  }

  public selectedDate(day) {
    const dayFormatted = day.format('YYYY/MM/DD');
    if (this.dateForm.valid) {
      this.dateForm.setValue({dateFrom: null, dateTo: null});
      return;
    }
    if (!this.dateForm.get('dateFrom').value) {
      this.dateForm.get('dateFrom').patchValue(dayFormatted);
    } else {
      this.dateForm.get('dateTo').patchValue(dayFormatted);
    }
  }

}
