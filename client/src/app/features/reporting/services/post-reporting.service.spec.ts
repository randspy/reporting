import { TestBed } from '@angular/core/testing';

import { PostReportingService } from './post-reporting.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { generateReporting } from '../../../../tests/object-generators';
import { of } from 'rxjs';
import { mockNotificationService } from '../../../../tests/mock-notification-service';
import { NotificationService } from '../../../core/shared/services/notification.service';

describe('PostReportingService', () => {
  let service: PostReportingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostReportingService,
        { provide: NotificationService, useValue: mockNotificationService },
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(PostReportingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save reporting', () => {
    it('should forward the createReporting method', (done) => {
      const reporting = generateReporting();

      service.createReporting = jest.fn().mockReturnValue(of(reporting));

      service.saveReporting(reporting).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });
    });

    it('should forward the isLoading signal', () => {
      service.isPostMethodLoading.set(true);

      expect(service.isPostMethodLoading()).toBe(true);
    });
  });
});
