import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const pastDateValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

    return inputDate > today ? { futureDate: true } : null;
  };
};
