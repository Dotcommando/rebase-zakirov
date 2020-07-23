import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class AppComponent implements OnInit {
  title = 'rebase-test';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
  ) {
    this.adapter.setLocale('ru');
  }

  ngOnInit(): void {
    const group: IForm = {
      fullname: ['', [
        Validators.required,
        Validators.pattern(/[а-яА-ЯёЁ\-]+[\s]{1}[а-яА-ЯёЁ]+$/)
      ]],
      gender: ['', []],
      birthday: ['', [
        Validators.required
      ]],
    };

    this.form = this.formBuilder.group(group);
  }

  /**
   * Чекаем все поля, чтобы отработал валидатор.
   * @param formGroup - форма
   */
  private markFormGroupTouched(formGroup: FormGroup | AbstractControl): void {
    if (!('controls' in formGroup)) { return; }
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ('controls' in control) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Ставим ограничение на возможные даты рождения.
   * С 01.01.1930 по текущую дату.
   * @param d - дата
   */
  birthdayPickerFilter = (d: Date): boolean => {
    const checkingDate = moment(d);
    const minimumDate = moment('01.01.1930', 'MM.DD.YYYY');
    const today = moment();
    return !(checkingDate.isBefore(minimumDate) || checkingDate.isAfter(today));
  }

  submit(): void {
    this.markFormGroupTouched(this.form);
  }
}

export interface IForm {
  fullname: { [key: string]: any };
  gender: { [key: string]: any };
  birthday: { [key: string]: any };
}
