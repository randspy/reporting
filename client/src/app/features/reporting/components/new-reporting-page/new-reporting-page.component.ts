import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportingService } from '../../services/reporting.service';
import { PostReportingService } from '../../services/post-reporting.service';
import { Observation } from '../../domain/observation.types';

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
export class NewReportingPageComponent {
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  observations = signal<Observation[]>([
    { id: 1, name: 'Observation 1' },
    { id: 2, name: 'Observation 2' },
    { id: 3, name: 'Observation 3' },
  ]);

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
