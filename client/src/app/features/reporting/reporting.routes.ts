import { Routes } from '@angular/router';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { NewReportingPageComponent } from './components/new-reporting-page/new-reporting-page.component';
import { ReportingService } from './services/reporting.service';
import { EditReportingPageComponent } from './components/edit-reporting-page/edit-reporting-page.component';

export const reportingRoutes: Routes = [
  {
    path: '',
    providers: [ReportingService],
    children: [
      { path: '', component: ReportingPageComponent },
      {
        path: 'new',
        component: NewReportingPageComponent,
      },
      {
        path: ':id',
        component: EditReportingPageComponent,
      },
    ],
  },
];
