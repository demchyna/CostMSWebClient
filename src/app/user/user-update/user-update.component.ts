import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import User from '../../models/User';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Role from '../../models/Role';
import {RoleService} from '../../role/role.service';
import {Subscription} from 'rxjs';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit, OnDestroy {

  paramsUserSubscription: Subscription;
  updateUserUserSubscription: Subscription;
  getAllRolesUserSubscription: Subscription;
  getUserByIdUserSubscription: Subscription;

  user: User = new User();
  roles: Role[];
  private userId: number;
  userErrors: Map<string, string> = new Map<string, string>();


  constructor(public userService: UserService,
              private roleService: RoleService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {

    this.paramsUserSubscription = this.route.params.subscribe( params => this.userId = params['id']);
  }

  updateUser(data: any): void {
    this.user.firstName = data.firstName;
    this.user.lastName = data.lastName;
    this.user.email = data.email;
    if (this.userService.isAdmin()) {
      this.user.authorities = data.authorities;
    }
    this.user.description = data.description;

    this.updateUserUserSubscription = this.userService.updateUser(this.user)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/users/' + this.userId + '/info']);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.userErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnInit() {
    if (this.userService.isAdmin()) {
      this.getAllRolesUserSubscription = this.roleService.getAllRoles()
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.roles = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    }

    this.getUserByIdUserSubscription = this.userService.getUserById(this.userId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.user  = response.body;
          this.breadcrumbService.addFriendlyNameForRouteRegex('/users/[0-9]+/update$', 'Редагувати');
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  changePassword() {
    this.router.navigate(['/users/' + this.userId + '/credential']);
  }

  ngOnDestroy(): void {
    if (this.paramsUserSubscription) {
      this.paramsUserSubscription.unsubscribe();
    }
    if (this.updateUserUserSubscription) {
      this.updateUserUserSubscription.unsubscribe();
    }
    if (this.getAllRolesUserSubscription) {
      this.getAllRolesUserSubscription.unsubscribe();
    }
    if (this.getUserByIdUserSubscription) {
      this.getUserByIdUserSubscription.unsubscribe();
    }
  }
}
