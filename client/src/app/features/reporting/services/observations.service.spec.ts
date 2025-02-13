import { TestBed } from '@angular/core/testing';

import { ObservationsService } from './observations.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { mockNotificationService } from '../../../../tests/mock-notification-service';
import { NotificationService } from '../../../core/shared/services/notification.service';
import { generateObservation } from '../../../../tests/object-generators';

describe('ObservationsService', () => {
  let service: ObservationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ObservationsService,
        { provide: NotificationService, useValue: mockNotificationService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ObservationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get observations', () => {
    const observations = [generateObservation()];

    service.getObservations().subscribe((obs) => {
      expect(obs).toEqual(observations);
    });

    const req = httpMock.expectOne('api/observations');
    expect(req.request.method).toBe('GET');
    req.flush(observations);
  });

  it('should throw an error', (done) => {
    service.getObservations().subscribe({
      error: (err) => {
        expect(err).toEqual({});
        done();
      },
    });

    const req = httpMock.expectOne('api/observations');
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(mockNotificationService.showError.mock.calls[0][1]).toEqual(
      'La récupération a échoué',
    );
  });

  it('should have the loading signal to false when the service is created', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set the loading signal to true', () => {
    service.getObservations().subscribe();

    expect(service.isLoading()).toBe(true);
  });

  it('should set the loading signal to false after the request is finished', () => {
    service.getObservations().subscribe();

    httpMock.expectOne('api/observations').flush([]);

    expect(service.isLoading()).toBe(false);
  });
});
