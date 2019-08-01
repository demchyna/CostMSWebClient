import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {REST_API_URL} from '../helpers/http-request-helper';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class UnitService {

  constructor(private httpClient: HttpClient) {  }

  getUnitById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/unit/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getAllUnits(): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/unit/all',
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

}
