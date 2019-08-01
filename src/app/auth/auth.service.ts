import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import User from '../models/User';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {throwError} from 'rxjs/internal/observable/throwError';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService ) {  }

  login(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
        REST_API_URL + '/login',
        JSON.stringify(user),
        { headers: requestHeaders, observe: 'response' }
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('jwt-token');
  }

  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

}
