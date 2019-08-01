import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../category.service';
import {UserService} from '../../user/user.service';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import Category from '../../models/Category';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmComponent} from '../../confirm/confirm.component';
import User from '../../models/User';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.css']
})
export class CategoryInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteCategorySubscription: Subscription;

  user: User = new User();
  category: Category = new Category();
  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private categoryService: CategoryService,
              public userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private breadcrumbService: BreadcrumbService) {  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.getCategoryByIdSubscription = this.categoryService.getCategoryById(params['id'])
        .subscribe((categoryResp: HttpResponse<any>) => {
          if (categoryResp) {
            tokenSetter(categoryResp);
            this.category = categoryResp.body;
            this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/category/[0-9]+/info$', this.category.name);
            this.getUserByIdSubscription = this.userService.getUserById(this.category.userId)
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

  editCategory(categoryId: number) {
    this.router.navigate(['user/' + this.user.id + '/category/' + categoryId + '/update']);
  }

  deleteCategory(categoryId: number) {
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
                    this.router.navigate(['/user/' + this.user.id + '/category']);
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
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
  }

}
