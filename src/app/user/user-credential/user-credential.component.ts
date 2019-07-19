import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {Subscription} from 'rxjs';
import User from '../../models/User';
import {UserService} from '../user.service';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-user-credential',
  templateUrl: './user-credential.component.html',
  styleUrls: ['./user-credential.component.css']
})
export class UserCredentialComponent implements OnInit, OnDestroy {

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  paramsUserSubscription: Subscription;
  checkPasswordByLoginUserSubscription: Subscription;
  updateUserUserSubscription: Subscription;
  getUserByIdUserSubscription: Subscription;

  userCredential: User = new User();
  user: User = new User();

  userErrors: Map<string, string> = new Map<string, string>();

  constructor(protected userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.paramsUserSubscription = this.route.params.subscribe( params => {
      this.getUserByIdUserSubscription = this.userService.getUserById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.user  = response.body;
            this.breadcrumbService.addFriendlyNameForRouteRegex('/users/[0-9]+/credential', 'Логін та пароль');
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  updateUser(data: any): void {

    this.userErrors = new Map<string, string>();

    this.userCredential.id = this.user.id;
    this.userCredential.password = data.oldPassword;

    this.checkPasswordByLoginUserSubscription = this.userService.checkPasswordByUserId(this.userCredential)
      .subscribe((credentialResp: HttpResponse<any>) => {
        if (credentialResp) {

          this.user.username = data.username;

          if (data.newPassword === data.confirm) {
            this.user.password = data.newPassword;
          } else {
            this.userErrors['confirm'] = 'Повинен співпадати з паролем вказаним у полі \'Новий пароль\'.';
            return;
          }

          this.updateUserUserSubscription = this.userService.updateUser(this.user)
            .subscribe((userResp: HttpResponse<any>) => {
              if (userResp) {
                tokenSetter(userResp);
                this.router.navigate(['/users/' + this.user.id + '/info']);
              }
            }, (appError: AppError) => {
              if (appError.status === 422) {
                this.userErrors = (<ValidationError>appError.error).validationErrors;
              } else {
                throw appError;
              }
            });

        }
      }, (appError: AppError) => {
        if (appError.status === 400) {
          this.userErrors['old-password'] = 'Введений Вами пароль не є коректним паролем для цього користувача.';
        } else {
          throw appError;
        }
      });

  }

  ngOnDestroy(): void {
    if (this.paramsUserSubscription) {
      this.paramsUserSubscription.unsubscribe();
    }
    if (this.checkPasswordByLoginUserSubscription) {
      this.checkPasswordByLoginUserSubscription.unsubscribe();
    }
    if (this.updateUserUserSubscription) {
      this.updateUserUserSubscription.unsubscribe();
    }
    if (this.getUserByIdUserSubscription) {
      this.getUserByIdUserSubscription.unsubscribe();
    }
  }

}
