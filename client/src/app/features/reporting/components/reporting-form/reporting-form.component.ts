import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Reporting } from '../../domain/reporting.types';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  futureDateValidator,
  olderThen100YearsValidator,
} from '../../validators/date-validators';
import { ReportingService } from '../../services/reporting.service';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';
import { Observation } from '../../domain/observation.types';

@Component({
  selector: 'app-reporting-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    LoaderComponent,
  ],
  templateUrl: './reporting-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  standalone: true,
})
export class ReportingFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  #reportingService = inject(ReportingService);

  isLoading = this.#reportingService.isLoading;

  header = input<string>('');
  reporting = input<Reporting | null>();
  observations = input<Observation[]>();
  save = output<void>();
  dismiss = output<void>();

  initialValue = signal<Reporting | null>(null);

  form = this.formBuilder.group({
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    birth_date: [
      null as Date | null,
      [
        Validators.required,
        futureDateValidator(),
        olderThen100YearsValidator(),
      ],
    ],
    sex: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [''],
    observations: [[] as number[]],
  });

  ngOnInit() {
    const reporting = this.reporting();

    if (reporting) {
      this.form.patchValue({
        last_name: reporting.author.last_name,
        first_name: reporting.author.first_name,
        birth_date: new Date(reporting.author.birth_date),
        sex: reporting.author.sex,
        email: reporting.author.email,
        description: reporting.description,
        observations: reporting.observations,
      });
    }

    this.initialValue.set(
      reporting
        ? reporting
        : this.convertFormValueToReporting(this.form.value, 0),
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const reporting: Reporting = this.convertFormValueToReporting(
        this.form.value,
        this.initialValue()?.id || 0,
      );

      this.#reportingService.saveReporting(reporting).subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          if (error) {
            this.setServerError('email', error.author.email);
          }
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.dismiss.emit();
  }

  convertFormValueToReporting(
    formValue: typeof this.form.value,
    id: number,
  ): Reporting {
    return {
      id: id,
      author: {
        first_name: formValue.first_name || '',
        last_name: formValue.last_name || '',
        birth_date: formValue.birth_date?.toISOString().split('T')[0] || '',
        sex: formValue.sex || '',
        email: formValue.email || '',
      },
      description: formValue.description || '',
      observations: formValue.observations || [],
    };
  }

  setServerError(fieldPath: string, errors: string[]) {
    const control = this.form.get(fieldPath);

    if (control) {
      control.setErrors({ server: errors });
      control.markAsTouched();
    }
  }
}
