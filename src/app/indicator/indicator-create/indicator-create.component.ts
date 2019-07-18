import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Indicator from '../../models/Indicator';
import {IndicatorService} from '../indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import Meter from '../../models/Meter';
import {tokenSetter} from '../../helpers/http-request-helper';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import Tariff from '../../models/Tariff';
import {Subscription} from 'rxjs';
import {UserService} from '../../user/user.service';
import ValidationError from '../../models/ValidationError';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-indicator-create',
  templateUrl: './indicator-create.component.html',
  styleUrls: ['./indicator-create.component.css']
})
export class IndicatorCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  getTariffByCategoryIdSubscription: Subscription;
  getLastAddedIndicatorByMeterIdSubscription: Subscription;
  createIndicatorSubscription: Subscription;

  meter: Meter = new Meter();
  tariffs: Tariff[] = [];
  lastIndicator: Indicator = new Indicator();
  indicatorErrors: Map<string, string> = new Map<string, string>();

  constructor(
    private indicatorService: IndicatorService,
    private meterService: MeterService,
    private tariffService: TariffService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getMeterByIdSubscription = this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter = response.body;

            this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/meter/[0-9]+/indicator/create$', 'Додати показник');

            this.getTariffByCategoryIdSubscription = this.tariffService.getTariffByCategoryId(this.meter.categoryId)
              .subscribe((resp: HttpResponse<any>) => {
                if (resp) {
                  this.tariffs = resp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

          }
        }, (appError: AppError) => {
          throw appError;
        });

      this.getLastAddedIndicatorByMeterIdSubscription = this.indicatorService.getLastAddedIndicatorByMeterId(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.lastIndicator = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });

    });
  }

  createIndicator(data: any): void {
    const indicator = new Indicator();

    indicator.current = data.current;
    indicator.date = data.date;
    indicator.payment = data.payment;
    if (this.lastIndicator) {
      indicator.previousId = this.lastIndicator.id;
    }
    indicator.meterId = this.meter.id;
    if (data.tariff) {
      indicator.tariffId = data.tariff.id;
    }
    indicator.description = data.description;
    indicator.userId = this.meter.userId;

    this.createIndicatorSubscription = this.indicatorService.createIndicator(indicator)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate([this.router.url.substring(0, this.router.url.length - 7)]);
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
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.getTariffByCategoryIdSubscription) {
      this.getTariffByCategoryIdSubscription.unsubscribe();
    }
    if (this.getLastAddedIndicatorByMeterIdSubscription) {
      this.getLastAddedIndicatorByMeterIdSubscription.unsubscribe();
    }
    if (this.createIndicatorSubscription) {
      this.createIndicatorSubscription.unsubscribe();
    }
  }
}
