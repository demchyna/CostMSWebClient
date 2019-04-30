import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import AppError from '../errors/app-error';
import {REST_API_URL} from '../helpers/http-request-helper';
import {Observable} from 'rxjs';
import Category from '../models/Category';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getCategoryById(id: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/category/id/' + id,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  getCategoryByUserId(userId: number): Observable<any> {
    return this.httpClient.get<any>(
      REST_API_URL + '/api/category/user/' + userId,
      { observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  createCategory(category: Category): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.post<any>(
      REST_API_URL + '/api/category/create',
      JSON.stringify(category),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  updateCategory(category: Category): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.put<any>(
      REST_API_URL + '/api/category/update',
      JSON.stringify(category),
      { headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }

  deleteCategory(category: Category): Observable<any> {
    const requestHeaders = { 'Content-Type': 'application/json' };
    return this.httpClient.request<any>(
      'delete',
    REST_API_URL + '/api/category/delete',
      { body: JSON.stringify(category), headers: requestHeaders, observe: 'response' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(new AppError(error));
      })
    );
  }
}
