import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import Category from '../../models/Category';
import {MeterService} from '../../meter/meter.service';
import {UserService} from '../../user/user.service';
import {Subscription} from 'rxjs';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import User from '../../models/User';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  getCategoryByUserIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteCategorySubscription: Subscription;

  collapseStatuses: boolean[];
  user: User = new User();
  userId: number;
  categories: Category[] = [];
  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private categoryService: CategoryService,
              private meterService: MeterService,
              public userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private breadcrumbService: BreadcrumbService) {  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.userId = params['id'];
      this.getCategoryByUserIdSubscription = this.categoryService.getCategoryByUserId(this.userId)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.categories = response.body;
            this.collapseStatuses = new Array(this.categories.length).fill(false);
            this.breadcrumbService.addFriendlyNameForRouteRegex('/user/[0-9]+/category$', 'Категорії');
            this.getUserByIdSubscription = this.userService.getUserById(this.userId)
              .subscribe((userResp: HttpResponse<any>) => {
                if (userResp) {
                  tokenSetter(userResp);
                  this.user = userResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  addCategory() {
    this.router.navigate(['user/' + this.userId + '/category/create']);
  }

  infoCategory(categoryId: number, event) {
    event.stopPropagation();
    this.router.navigate([this.router.url + '/' + categoryId + '/info']);
  }

  editCategory(categoryId: number, event) {
    event.stopPropagation();
    this.router.navigate([this.router.url + '/' + categoryId + '/update']);
  }

  deleteCategory(categoryId: number, event) {
    event.stopPropagation();
    this.getCategoryByIdSubscription = this.categoryService.getCategoryById(categoryId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const category = response.body;
          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити категорію з назвою "${category.name}"?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.deleteCategorySubscription = this.categoryService.deleteCategory(category)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    this.ngOnInit();
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

  addMeter(categoryId: number) {
    this.router.navigate([this.router.url + '/' + categoryId + '/meter/create']);
  }

  tariffsList(categoryId: number) {
    this.router.navigate([this.router.url + '/' + categoryId + '/tariff']);
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByUserIdSubscription) {
      this.getCategoryByUserIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
  }
}
