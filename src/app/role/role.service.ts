import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {REST_API_URL} from '../helpers/http-request-helper';
import AppError from '../errors/app-error';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class RoleService {

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/role/all',
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getRoleById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/role/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

}
