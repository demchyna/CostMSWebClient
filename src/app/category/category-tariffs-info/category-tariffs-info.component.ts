import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import Category from '../../models/Category';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-category-tariffs-info',
  templateUrl: './category-tariffs-info.component.html',
  styleUrls: ['./category-tariffs-info.component.css']
})
export class CategoryTariffsInfoComponent implements OnInit, OnDestroy {

  getCategoryByIdSubscription: Subscription;

  category: Category = new Category();

  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.getCategoryByIdSubscription = this.categoryService.getCategoryById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.category  = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  addTariff() {
    this.router.navigate(['tariff/create/category/' + this.category.id]);
  }

  ngOnDestroy(): void {
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
  }
}
