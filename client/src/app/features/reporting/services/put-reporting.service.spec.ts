import { TestBed } from '@angular/core/testing';

import { PutReportingService } from './put-reporting.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { generateReporting } from '../../../../tests/object-generators';
import { mockNotificationService } from '../../../../tests/mock-notification-service';
import { NotificationService } from '../../../core/shared/services/notification.service';

describe('PutReportingService', () => {
  let service: PutReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PutReportingService,
        { provide: NotificationService, useValue: mockNotificationService },
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(PutReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save reporting', () => {
    it('should forward the updateReporting method', (done) => {
      const reporting = generateReporting();

      service.updateReporting = jest.fn().mockReturnValue(of(reporting));

      service.saveReporting(reporting).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });
    });

    it('should forward the isLoading signal', () => {
      service.isPutMethodLoading.set(true);

      expect(service.isPutMethodLoading()).toBe(true);
    });
  });
});
