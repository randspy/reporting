import { Routes } from '@angular/router';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { NewReportingPageComponent } from './components/new-reporting-page/new-reporting-page.component';

export const reportingRoutes: Routes = [
  { path: '', component: ReportingPageComponent },
  { path: 'new', component: NewReportingPageComponent },
];
