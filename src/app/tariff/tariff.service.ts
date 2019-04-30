import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {REST_API_URL} from '../helpers/http-request-helper';
import AppError from '../errors/app-error';
import Tariff from '../models/Tariff';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class TariffService {

  constructor(private httpClient: HttpClient) { }

  getTariffById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/tariff/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getTariffByCategoryId(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/tariff/category/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  createTariff(tariff: Tariff): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/tariff/create',
      JSON.stringify(tariff),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateTariff(tariff: Tariff): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/tariff/update',
      JSON.stringify(tariff),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteTariff(tariff: Tariff): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
      REST_API_URL + '/api/tariff/delete',
      { body: JSON.stringify(tariff), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }
}
