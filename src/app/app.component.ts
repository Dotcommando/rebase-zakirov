import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rebase-test';
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const group: IForm = {
      fullname: ['', [
        Validators.required,
        Validators.pattern(/[а-яА-ЯёЁ\-]+[\s]{1}[а-яА-ЯёЁ]+$/)
      ]],
      gender: ['', [
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

  submit(): void {
    this.markFormGroupTouched(this.form);
  }
}

export interface IForm {
  fullname: { [key: string]: any };
  gender: { [key: string]: any };
}
