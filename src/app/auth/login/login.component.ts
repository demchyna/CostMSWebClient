import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import {tokenSetter} from '../../helpers/http-request-helper';
import {Subscription} from 'rxjs';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import ValidationError from '../../models/ValidationError';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  userErrors: Map<string, string> = new Map<string, string>();

  hidePassword = true;

  loginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    // iconRegistry.addSvgIcon(
    //   'visibility',
    //   sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/visibility-24px.svg'));
    // iconRegistry.addSvgIcon(
    //   'visibility_off',
    //   sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/visibility_off-24px.svg'));
  }

  signIn(data: any): void {
    const user = new User;
    user.username = data.username;
    user.password = data.password;

    this.loginSubscription = this.authService.login(user)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/']);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.userErrors = (<ValidationError>appError.error).validationErrors;
        } else if (appError.status === 401) {
          this.userErrors['username'] = 'Користувача з таким логіном або паролем не знайдено.';
          this.userErrors['password'] = 'Користувача з таким логіном або паролем не знайдено.';
        } else {
          throw appError;
        }
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
