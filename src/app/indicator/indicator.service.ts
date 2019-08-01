import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs';
import Indicator from '../models/Indicator';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class IndicatorService {

  constructor(private httpClient: HttpClient) {  }

  getIndicatorById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getIndicatorByMeterId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/meter/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  createIndicator(indicator: Indicator): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/indicator/create',
      JSON.stringify(indicator),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getLastAddedIndicatorByMeterId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/indicator/last/meter/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateIndicator(indicator: Indicator): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/indicator/update',
      JSON.stringify(indicator),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteIndicator(indicator: Indicator): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
      REST_API_URL + '/api/indicator/delete',
      { body: JSON.stringify(indicator), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

}
