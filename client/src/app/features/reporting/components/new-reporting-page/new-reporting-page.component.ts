import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReportingFormComponent } from '../reporting-form/reporting-form.component';

@Component({
  selector: 'app-new-reporting-page',
  imports: [ReportingFormComponent],
  templateUrl: './new-reporting-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportingPageComponent {}
