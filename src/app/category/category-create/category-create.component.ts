import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Category from '../../models/Category';
import {CategoryService} from '../category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../user/user.service';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  createCategorySubscription: Subscription;

  categoryErrors: Map<string, string> = new Map<string, string>();

  constructor(private categoryService: CategoryService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {

    this.breadcrumbService.addFriendlyNameForRouteRegex('/user/[0-9]+/category/create$', 'Додати');
  }

  ngOnInit() {  }

  createCategory(data: any): void {

    this.paramsSubscription = this.route.params.subscribe( params => {

      const category = new Category();

      category.name = data.name;
      category.description = data.description;
      category.userId = params['id'];

      this.createCategorySubscription = this.categoryService.createCategory(category)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            this.router.navigate(['/user/' + params['id'] + '/category']);
          }
        }, (appError: AppError) => {
          if (appError.status === 422) {
            this.categoryErrors = (<ValidationError>appError.error).validationErrors;
          } else {
            throw appError;
          }
        });
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.createCategorySubscription) {
      this.createCategorySubscription.unsubscribe();
    }
  }
}
