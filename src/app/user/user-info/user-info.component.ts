import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import User from '../../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {changeDateFormat, changeTimeFormat} from '../../helpers/date-format-helper';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {

  paramsUserSubscription: Subscription;
  getUserByIdUserSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  deleteUserUserSubscription: Subscription;

  dateFormatter = changeDateFormat;
  timeFormatter = changeTimeFormat;

  user: User = new User();

  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(protected userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {  }

  ngOnInit() {
    this.paramsUserSubscription = this.route.params.subscribe( params => {
      this.getUserByIdUserSubscription = this.userService.getUserById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.user  = response.body;
            this.user.createDate = (new Date(response.body.createDate)).toLocaleString();
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  editUser(userId: number) {
    this.router.navigate(['/user/' + userId + '/update']);
  }

  deleteUser(userId: number) {

    this.getUserByIdSubscription = this.userService.getUserById(userId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const user = response.body;

          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити користувача "${user.username}"?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {

              this.deleteUserUserSubscription = this.userService.deleteUser(user)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    if (this.userService.currentUser.id === userId) {
                      this.authService.logout();
                      this.router.navigate(['/login']);
                    } else {
                      this.router.navigate(['/user/all']);
                    }
                  }
                }, (appError: AppError) => {
                  throw appError;
                });

            }
            this.dialogRef = null;
          });

        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsUserSubscription) {
      this.paramsUserSubscription.unsubscribe();
    }
    if (this.getUserByIdUserSubscription) {
      this.getUserByIdUserSubscription.unsubscribe();
    }
    if (this.getUserByIdSubscription) {
      this.getUserByIdSubscription.unsubscribe();
    }
    if (this.deleteUserUserSubscription) {
      this.deleteUserUserSubscription.unsubscribe();
    }
  }
}
