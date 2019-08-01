import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Category from '../../models/Category';
import {CategoryService} from '../category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../user/user.service';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  updateCategorySubscription: Subscription;

  category: Category = new Category();
  private categoryId: number;
  categoryName: string;
  categoryErrors: Map<string, string> = new Map<string, string>();

  constructor(private categoryService: CategoryService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {
    this.paramsSubscription = this.route.params.subscribe( params => this.categoryId = params['id']);
  }

  ngOnInit() {
    this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.categoryId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.category = response.body;
          this.categoryName = this.category.name;
          this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/category/[0-9]+/update$', 'Редагувати');
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateCategory(data: any): void {
    this.category.name = data.name;
    this.category.description = data.description;
    this.updateCategorySubscription = this.categoryService.updateCategory(this.category)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/user/' + this.category.userId + '/category']);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.categoryErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.updateCategorySubscription) {
      this.updateCategorySubscription.unsubscribe();
    }
  }
}
