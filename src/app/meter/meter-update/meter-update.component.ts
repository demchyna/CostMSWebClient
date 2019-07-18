import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {MeterService} from '../meter.service';
import {CategoryService} from '../../category/category.service';
import {UnitService} from '../../unit/unit.service';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import Meter from '../../models/Meter';
import Unit from '../../models/Unit';
import Category from '../../models/Category';
import {Subscription} from 'rxjs';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-meter-update',
  templateUrl: './meter-update.component.html',
  styleUrls: ['./meter-update.component.css']
})
export class MeterUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  getAllUnitsSubscription: Subscription;
  getCategoryByUserIdSubscription: Subscription;
  updateMeterSubscription: Subscription;

  meterId: number;
  meter: Meter = new Meter();
  units: Unit[] = [];
  currentUnitId: number;
  category: Category = new Category();
  categories: Category[] = [];
  currentCategoryId: number;
  meterErrors: Map<string, string> = new Map<string, string>();

  constructor(private meterService: MeterService,
              private categoryService: CategoryService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {

    this.paramsSubscription = this.route.params.subscribe( params => this.meterId = params['id']);
  }

  ngOnInit() {
    this.getMeterByIdSubscription = this.meterService.getMeterById(this.meterId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.meter = response.body;

          this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/meter/[0-9]+/update$', 'Редагувати лічильник');

          this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.meter.categoryId)
            .subscribe((categoryResp: HttpResponse<any>) => {
              if (categoryResp) {
                tokenSetter(categoryResp);
                this.category = categoryResp.body;

                this.getCategoryByUserIdSubscription = this.categoryService.getCategoryByUserId(this.category.userId)
                  .subscribe((categoriesResp: HttpResponse<any>) => {
                    if (categoriesResp) {
                      this.categories = categoriesResp.body;
                      this.categories.map((category, index) => {
                        if (category.id === this.meter.categoryId) {
                          this.currentCategoryId = index;
                        }
                      });
                    }
                  }, (appError: AppError) => {
                    throw appError;
                  });
              }
            }, (appError: AppError) => {
              throw appError;
            });

          this.getAllUnitsSubscription = this.unitService.getAllUnits()
            .subscribe((unitResp: HttpResponse<any>) => {
              if (unitResp) {
                this.units = unitResp.body;
                this.units.map((unit, index) => {
                  if (unit.id === this.meter.unitId) {
                    this.currentUnitId = index;
                  }
                });
              }
            }, (appError: AppError) => {
              throw appError;
            });
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateMeter(data: any): void {

    this.meter.name = data.name;
    this.meter.description = data.description;

    if (data.category) {
      this.meter.categoryId = data.category.id;
    }

    if (data.unit) {
      this.meter.unitId = data.unit.id;
    }

    this.updateMeterSubscription = this.meterService.updateMeter(this.meter)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate([this.router.url.replace('update', 'info')]);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.meterErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.getAllUnitsSubscription) {
      this.getAllUnitsSubscription.unsubscribe();
    }
    if (this.getCategoryByUserIdSubscription) {
      this.getCategoryByUserIdSubscription.unsubscribe();
    }
    if (this.updateMeterSubscription) {
      this.updateMeterSubscription.unsubscribe();
    }
  }
}
