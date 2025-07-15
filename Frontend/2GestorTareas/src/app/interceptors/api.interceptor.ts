import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Error de conexión:', error);
        } else if (error.status >= 400 && error.status < 500) {
          console.error('Error del cliente:', error);
        } else if (error.status >= 500) {
          console.error('Error del servidor:', error);
        }

        return throwError(() => error);
      })
    );
  }
}
