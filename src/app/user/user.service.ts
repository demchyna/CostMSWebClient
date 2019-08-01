import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import User from '../models/User';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {  }

  createUser(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/registration',
      JSON.stringify(user),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/user/all',
      { observe: 'response' }
      ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getUserById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/user/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  checkPasswordByUserId(userCredential: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/user/credential',
      JSON.stringify(userCredential),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateUser(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/user/update',
      JSON.stringify(user),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteUser(user: User): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
      REST_API_URL + '/api/user/delete',
      { body: JSON.stringify(user), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  get currentUser() {
    const jwtToken = sessionStorage.getItem('jwt-token');
    if (!jwtToken) {
      return null;
    }
    return new JwtHelperService().decodeToken(jwtToken);
  }

  isAdmin(): boolean {
    let isAdmin = false;
    this.currentUser.roles.map( (role) => {
      if (role.name === 'admin') {
        isAdmin = true;
      }
    });
    return isAdmin;
  }
}
