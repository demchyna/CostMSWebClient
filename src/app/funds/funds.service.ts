import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {REST_API_URL} from '../helpers/http-request-helper';
import {catchError} from 'rxjs/operators';
import AppError from '../errors/app-error';
import Funds, {FundsType} from '../models/Funds';

@Injectable()
export class FundsService {

  constructor(private httpClient: HttpClient) { }

  getFundsById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/funds/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getFundsByUserId(userId: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/funds/user/' + userId,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  createFunds(data: Funds): Observable<any> {
    const funds: any = data;
    funds.type = FundsType[funds.type];
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/funds/create',
      JSON.stringify(funds),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateFunds(funds: Funds): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/funds/update',
      JSON.stringify(funds),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteFunds(funds: Funds): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
      REST_API_URL + '/api/funds/delete',
      { body: JSON.stringify(funds), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }


}
