import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../../category/category.service';
import {TariffService} from '../tariff.service';
import {UnitService} from '../../unit/unit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import Tariff from '../../models/Tariff';
import Unit from '../../models/Unit';
import {Subscription} from 'rxjs';
import ValidationError from '../../models/ValidationError';
import Category from '../../models/Category';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-tariff-update',
  templateUrl: './tariff-update.component.html',
  styleUrls: ['./tariff-update.component.css']
})
export class TariffUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  getAllUnitsSubscription: Subscription;
  updateTariffSubscription: Subscription;

  tariffId: number;
  tariff: Tariff = new Tariff();
  category: Category = new Category();
  units: Unit[] = [];
  currentUnitId: number;
  tariffErrors: Map<string, string> = new Map<string, string>();

  constructor(private categoryService: CategoryService,
              private tariffService: TariffService,
              private unitService: UnitService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {
    this.paramsSubscription = this.route.params.subscribe( params => this.tariffId = params['id']);
  }

  ngOnInit() {
    this.getTariffByIdSubscription = this.tariffService.getTariffById(this.tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.tariff = response.body;

          this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/tariff/[0-9]+/update', 'Редагувати');

          this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.tariff.categoryId)
            .subscribe((tariffResp: HttpResponse<any>) => {
              if (tariffResp) {
                tokenSetter(tariffResp);
                this.category = tariffResp.body;
              }
            }, (appError: AppError) => {
              throw appError;
            });

          this.getAllUnitsSubscription = this.unitService.getAllUnits()
            .subscribe((unitResp: HttpResponse<any>) => {
              if (unitResp) {
                this.units = unitResp.body;

                this.units.map((unit, index) => {
                  if (unit.id === this.tariff.unitId) {
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

  updateTariff(data: any): void {

    this.tariff.name = data.name;
    this.tariff.rate = data.rate;
    this.tariff.currency = data.currency;
    this.tariff.beginDate = data.beginDate;
    if (data.endDate) {
      this.tariff.endDate = data.endDate;
    }
    this.tariff.description = data.description;

    if (data.unit) {
      this.tariff.unitId = data.unit.id;
    }

    this.updateTariffSubscription = this.tariffService.updateTariff(this.tariff)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate([this.router.url.replace('update', 'info')]);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.tariffErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.getAllUnitsSubscription) {
      this.getAllUnitsSubscription.unsubscribe();
    }
    if (this.updateTariffSubscription) {
      this.updateTariffSubscription.unsubscribe();
    }
  }
}
