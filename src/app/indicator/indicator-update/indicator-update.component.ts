import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Indicator from '../../models/Indicator';
import {IndicatorService} from '../indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import Meter from '../../models/Meter';
import Tariff from '../../models/Tariff';
import {Subscription} from 'rxjs';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-indicator-update',
  templateUrl: './indicator-update.component.html',
  styleUrls: ['./indicator-update.component.css']
})
export class IndicatorUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getIndicatorByIdSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  getTariffByCategoryIdSubscription: Subscription;
  updateIndicatorSubscription: Subscription;

  indicator: Indicator = new Indicator();
  private indicatorId: number;
  meter: Meter = new Meter();
  tariffs: Tariff[] = [];
  currentTariffId: number;
  indicatorErrors: Map<string, string> = new Map<string, string>();

  constructor(private indicatorService: IndicatorService,
              private meterService: MeterService,
              private tariffService: TariffService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {
    this.paramsSubscription = this.route.params.subscribe( params => this.indicatorId = params['id']);
  }

  ngOnInit() {
    this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(this.indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.indicator = response.body;
          this.getMeterByIdSubscription = this.meterService.getMeterById(this.indicator.meterId)
            .subscribe((meterResp: HttpResponse<any>) => {
              if (meterResp) {
                tokenSetter(meterResp);
                this.meter = meterResp.body;

                this.breadcrumbService.addFriendlyNameForRouteRegex('/indicator/[0-9]+/update$', 'Редагувати показник');

                this.getTariffByCategoryIdSubscription = this.tariffService.getTariffByCategoryId(this.meter.categoryId)
                  .subscribe((tariffResp: HttpResponse<any>) => {
                    if (tariffResp) {
                      this.tariffs = tariffResp.body;

                      this.tariffs.map((tariff, index) => {
                        if (tariff.id === this.indicator.tariffId) {
                          this.currentTariffId = index;
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
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateIndicator(data: any): void {

    this.indicator.current = data.current;
    this.indicator.date = data.date;
    this.indicator.payment = data.payment;
    this.indicator.tariffId = data.tariff.id;
    this.indicator.description = data.description;

    this.updateIndicatorSubscription = this.indicatorService.updateIndicator(this.indicator)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate([this.router.url.replace('update', 'info')]);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.indicatorErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getIndicatorByIdSubscription) {
      this.getIndicatorByIdSubscription.unsubscribe();
    }
    if (this.getTariffByCategoryIdSubscription) {
      this.getTariffByCategoryIdSubscription.unsubscribe();
    }
    if (this.updateIndicatorSubscription) {
      this.updateIndicatorSubscription.unsubscribe();
    }
  }
}
