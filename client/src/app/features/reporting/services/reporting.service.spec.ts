import { TestBed } from '@angular/core/testing';

import { ReportingService } from './reporting.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { generateReporting } from '../../../../tests/object-generators';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ReportingService', () => {
  let service: ReportingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportingService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ReportingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('post reporting', () => {
    it('should create a reporting', (done) => {
      const reporting = generateReporting();

      service.createReporting(reporting).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });

      const req = httpMock.expectOne('api/reportings');
      expect(req.request.method).toBe('POST');
      req.flush(reporting);
    });

    it('should throw an error', (done) => {
      const reporting = generateReporting();

      service.createReporting(reporting).subscribe({
        error: (err) => {
          expect(err).toEqual({
            author: {
              email: 'This email is already exists',
            },
          });
          done();
        },
      });

      const req = httpMock.expectOne('api/reportings');
      expect(req.request.method).toBe('POST');
      req.flush(
        {
          author: {
            email: 'This email is already exists',
          },
        },
        {
          status: 400,
          statusText: 'Bad Request',
        },
      );
    });

    it('should have the loading signal to false when the service is created', () => {
      expect(service.isPostMethodLoading()).toBe(false);
    });

    it('should set the loading signal to true', () => {
      service.createReporting(generateReporting()).subscribe();

      expect(service.isPostMethodLoading()).toBe(true);
    });

    it('should set the loading signal to false after the request is finished', () => {
      service.createReporting(generateReporting()).subscribe();

      httpMock.expectOne('api/reportings').flush(generateReporting());

      expect(service.isPostMethodLoading()).toBe(false);
    });
  });

  describe('put reporting', () => {
    it('should create a reporting', (done) => {
      const reporting = generateReporting({
        id: 1,
      });

      service.updateReporting(reporting).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });

      const req = httpMock.expectOne('api/reportings/1');
      expect(req.request.method).toBe('PUT');
      req.flush(reporting);
    });

    it('should throw an error', (done) => {
      const reporting = generateReporting({
        id: 1,
      });

      service.updateReporting(reporting).subscribe({
        error: (err) => {
          expect(err).toEqual({
            author: {
              email: 'This email is already exists',
            },
          });
          done();
        },
      });

      const req = httpMock.expectOne('api/reportings/1');
      expect(req.request.method).toBe('PUT');
      req.flush(
        {
          author: {
            email: 'This email is already exists',
          },
        },
        {
          status: 400,
          statusText: 'Bad Request',
        },
      );
    });

    it('should have the loading signal to false when the service is created', () => {
      expect(service.isPutMethodLoading()).toBe(false);
    });

    it('should set the loading signal to true', () => {
      service.updateReporting(generateReporting()).subscribe();

      expect(service.isPutMethodLoading()).toBe(true);
    });

    it('should set the loading signal to false after the request is finished', () => {
      service.updateReporting(generateReporting({ id: 1 })).subscribe();

      httpMock.expectOne('api/reportings/1').flush(generateReporting());

      expect(service.isPutMethodLoading()).toBe(false);
    });
  });

  describe('get all reportings', () => {
    it('should return all reportings', (done) => {
      const reportings = generateReporting();

      service.getReportings().subscribe((res) => {
        expect(res).toEqual(reportings);
        done();
      });

      const req = httpMock.expectOne('api/reportings');
      expect(req.request.method).toBe('GET');
      req.flush(reportings);
    });

    it('should have the loading signal to false when the service is created', () => {
      expect(service.isGetMethodLoading()).toBe(false);
    });

    it('should set the loading signal to true', () => {
      service.getReportings().subscribe();

      expect(service.isGetMethodLoading()).toBe(true);
    });

    it('should set the loading signal to false after the request is finished', () => {
      service.getReportings().subscribe();

      httpMock.expectOne('api/reportings').flush(generateReporting());

      expect(service.isGetMethodLoading()).toBe(false);
    });
  });

  describe('get reporting', () => {
    it('should return a reporting', (done) => {
      const reporting = generateReporting();

      service.getReporting(reporting.id).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });

      const req = httpMock.expectOne(`api/reportings/${reporting.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(reporting);
    });

    it('should have the loading signal to false when the service is created', () => {
      expect(service.isGetMethodLoading()).toBe(false);
    });

    it('should set the loading signal to true', () => {
      service.getReporting(1).subscribe();

      expect(service.isGetMethodLoading()).toBe(true);
    });

    it('should set the loading signal to false after the request is finished', () => {
      service.getReporting(1).subscribe();

      httpMock.expectOne(`api/reportings/1`).flush(generateReporting());

      expect(service.isGetMethodLoading()).toBe(false);
    });
  });

  describe('save reporting', () => {
    it('should return the reporting', (done) => {
      const reporting = generateReporting();

      service.saveReporting(reporting).subscribe((res) => {
        expect(res).toEqual(reporting);
        done();
      });
    });
  });
});
