import { Injectable } from '@angular/core';
import { Reporting } from '../domain/reporting.types';
import { ReportingService } from './reporting.service';

@Injectable()
export class PutReportingService extends ReportingService {
  override isLoading = this.isPutMethodLoading;

  override saveReporting(reporting: Reporting) {
    return this.updateReporting(reporting);
  }
}
