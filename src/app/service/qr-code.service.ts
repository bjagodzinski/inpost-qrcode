import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { QrCodeCollectResponse, QrCodeReturnResponse } from '../shared/models/qr-code.response.interface';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  generateQrCodeForCollect(code: string): Observable<QrCodeCollectResponse> {
    return this.http.post<QrCodeCollectResponse>(`${this.apiUrl}/collect`, { code })
      .pipe(catchError(this.handleError));
  }

  generateQrCodeForReturn(code: string): Observable<QrCodeReturnResponse> {
    return this.http.post<QrCodeReturnResponse>(`${this.apiUrl}/return`, { code })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}`;
    }
    console.error(errorMessage);

    return throwError(() => error);
  }

}
