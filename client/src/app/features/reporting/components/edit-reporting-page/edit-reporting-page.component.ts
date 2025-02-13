import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';
import { Reporting } from '../../domain/reporting.types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ReportingService } from '../../services/reporting.service';
import { PutReportingService } from '../../services/put-reporting.service';
import { Observation } from '../../domain/observation.types';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { ObservationsService } from '../../services/observations.service';

@Component({
  selector: 'app-edit-reporting-page',
  imports: [
    ReportingFormComponent,
    LoaderComponent,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './edit-reporting-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ReportingService,
      useClass: PutReportingService,
    },
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-grow: 1;
      }
    `,
  ],
})
export class EditReportingPageComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #reportingService = inject(ReportingService);
  #observationsService = inject(ObservationsService);

  id = input.required<number>();
  reporting = signal<Reporting | null>(null);
  isLoading = this.#reportingService.isGetMethodLoading;

  observations = signal<Observation[]>([]);

  ngOnInit() {
    this.#reportingService.getReporting(this.id()).subscribe((reporting) => {
      this.reporting.set(reporting);
    });

    this.#observationsService.getObservations().subscribe((observations) => {
      this.observations.set(observations);
    });
  }

  onCancel() {
    this.navigateToParent();
  }

  onSave() {
    this.navigateToParent();
  }

  navigateToParent() {
    this.#router.navigate(['../'], { relativeTo: this.#route });
  }
}
