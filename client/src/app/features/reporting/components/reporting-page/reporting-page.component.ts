import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReportingService } from '../../services/reporting.service';
import { Reporting } from '../../domain/reporting.types';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reporting-page',
  imports: [RouterLink, LoaderComponent, MatButtonModule],
  templateUrl: './reporting-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex-grow flex;
      }
    `,
  ],
})
export class ReportingPageComponent implements OnInit {
  #reportingService = inject(ReportingService);

  isLoading = this.#reportingService.isGetMethodLoading;
  reportings = signal<Reporting[]>([]);

  ngOnInit(): void {
    this.#reportingService.getReportings().subscribe((reportings) => {
      this.reportings.set(reportings);
    });
  }
}
