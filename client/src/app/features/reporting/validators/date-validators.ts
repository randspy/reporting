import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const futureDateValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? { futureDate: true } : null;
  };
};

export const olderThen100YearsValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const age = today.getFullYear() - inputDate.getFullYear();

    return age > 100 ? { olderThan100Years: true } : null;
  };
};
