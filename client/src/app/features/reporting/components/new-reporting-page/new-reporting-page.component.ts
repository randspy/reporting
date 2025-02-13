import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportingService } from '../../services/reporting.service';
import { PostReportingService } from '../../services/post-reporting.service';
import { Observation } from '../../domain/observation.types';
import { ObservationsService } from '../../services/observations.service';

@Component({
  selector: 'app-new-reporting-page',
  imports: [ReportingFormComponent],
  templateUrl: './new-reporting-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex-grow;
      }
    `,
  ],
  providers: [
    {
      provide: ReportingService,
      useClass: PostReportingService,
    },
  ],
})
export class NewReportingPageComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #observationsService = inject(ObservationsService);

  observations = signal<Observation[]>([]);

  ngOnInit() {
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
