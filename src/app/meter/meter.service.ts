import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs';
import Meter from '../models/Meter';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class MeterService {

  constructor(private httpClient: HttpClient) { }

  getMeterByCategoryId(categoryId: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/meter/category/' + categoryId,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getMeterById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/meter/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  createMeter(meter: Meter): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/meter/create',
      JSON.stringify(meter),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateMeter(meter: Meter): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/meter/update',
      JSON.stringify(meter),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteMeter(meter: Meter): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
      REST_API_URL + '/api/meter/delete',
      { body: JSON.stringify(meter), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }
}
