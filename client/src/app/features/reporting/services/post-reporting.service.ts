import { Injectable } from '@angular/core';
import { Reporting } from '../domain/reporting.types';
import { ReportingService } from './reporting.service';

@Injectable()
export class PostReportingService extends ReportingService {
  override isLoading = this.isPostMethodLoading;

  override saveReporting(reporting: Reporting) {
    return this.createReporting(reporting);
  }
}
