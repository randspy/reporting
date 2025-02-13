import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observation } from '../domain/observation.types';
import { catchError, finalize, throwError } from 'rxjs';
import { NotificationService } from '../../../core/shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ObservationsService {
  #http = inject(HttpClient);
  #notificationService = inject(NotificationService);
  isLoading = signal(false);

  getObservations() {
    this.isLoading.set(true);
    return this.#http.get<Observation[]>('api/observations').pipe(
      catchError((error: HttpErrorResponse) => {
        this.#notificationService.showError(error, 'La récupération a échoué');
        return throwError(() => {
          return error.error;
        });
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }
}
