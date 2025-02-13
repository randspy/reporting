import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Reporting } from '../domain/reporting.types';
import { catchError, finalize, throwError, of } from 'rxjs';
import { NotificationService } from '../../../core/shared/services/notification.service';

@Injectable()
export class ReportingService {
  #http = inject(HttpClient);
  #notificationService = inject(NotificationService);

  // isLoading is used as abstraction and to be overridden by the child services
  isLoading = signal(false);

  isPostMethodLoading = signal(false);
  isPutMethodLoading = signal(false);
  isGetMethodLoading = signal(false);

  createReporting(reporting: Reporting) {
    this.isPostMethodLoading.set(true);
    return this.#http.post<Reporting>('api/reportings', reporting).pipe(
      catchError((error: HttpErrorResponse) => {
        this.#notificationService.showError(error, 'La création a échoué');
        return throwError(() => {
          return error.error;
        });
      }),
      finalize(() => this.isPostMethodLoading.set(false)),
    );
  }

  updateReporting(reporting: Reporting) {
    this.isPutMethodLoading.set(true);
    return this.#http
      .put<Reporting>(`api/reportings/${reporting.id}`, reporting)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#notificationService.showError(
            error,
            'La modification a échoué',
          );
          return throwError(() => {
            return error.error;
          });
        }),
        finalize(() => this.isPutMethodLoading.set(false)),
      );
  }

  getReportings() {
    this.isGetMethodLoading.set(true);
    return this.#http.get<Reporting[]>('api/reportings').pipe(
      catchError((error: HttpErrorResponse) => {
        this.#notificationService.showError(error, 'La récupération a échoué');
        return throwError(() => {
          return error.error;
        });
      }),
      finalize(() => this.isGetMethodLoading.set(false)),
    );
  }

  getReporting(id: number) {
    this.isGetMethodLoading.set(true);
    return this.#http.get<Reporting>(`api/reportings/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.#notificationService.showError(error, 'La récupération a échoué');
        return throwError(() => {
          return error.error;
        });
      }),
      finalize(() => this.isGetMethodLoading.set(false)),
    );
  }

  // saveReporting is used as abstraction and to be overridden by the child services
  saveReporting(reporting: Reporting) {
    return of(reporting);
  }
}
