import {Component, OnDestroy, OnInit} from '@angular/core';
import Indicator from '../../models/Indicator';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import Tariff from '../../models/Tariff';
import {tokenSetter} from '../../helpers/http-request-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {MeterService} from '../../meter/meter.service';
import {TariffService} from '../../tariff/tariff.service';
import {IndicatorService} from '../indicator.service';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs';
import {changeDateFormat} from '../../helpers/date-format-helper';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-indicator-info',
  templateUrl: './indicator-info.component.html',
  styleUrls: ['./indicator-info.component.css']
})
export class IndicatorInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getIndicatorByIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  deleteIndicatorSubscription: Subscription;

  dateFormatter = changeDateFormat;

  indicator: Indicator = new Indicator();
  tariff: Tariff = new Tariff();
  meter: Meter = new Meter();

  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private indicatorService: IndicatorService,
              private meterService: MeterService,
              private tariffService: TariffService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.indicator = response.body;
            this.indicator.price = parseFloat(this.indicator.price.toFixed(2));
            this.breadcrumbService.addFriendlyNameForRouteRegex('/indicator/[0-9]+/info$', 'Показник на ' +
              this.dateFormatter(this.indicator.date));

            this.getTariffByIdSubscription = this.tariffService.getTariffById(this.indicator.tariffId)
              .subscribe((tariffResp: HttpResponse<any>) => {
                if (tariffResp) {
                  tokenSetter(tariffResp);
                  this.tariff = tariffResp.body;
                }
              }, (appError: AppError) => {
                throw appError;
              });

            this.getMeterByIdSubscription = this.meterService.getMeterById(this.indicator.meterId)
              .subscribe((meterResp: HttpResponse<any>) => {
                if (meterResp) {
                  tokenSetter(meterResp);
                  this.meter = meterResp.body;
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

  editIndicator(indicatorId: number) {
    this.router.navigate([this.router.url.replace('info', 'update')]);
  }

  deleteIndicator(indicatorId: number) {
    this.getIndicatorByIdSubscription = this.indicatorService.getIndicatorById(indicatorId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const indicator = response.body;

          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити показник за ${this.dateFormatter(indicator.date)}?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {

              this.deleteIndicatorSubscription = this.indicatorService.deleteIndicator(indicator)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    const currentUserId = this.router.url.split('/')[1];
                    const currentCategoryId = this.router.url.split('/')[3];
                    this.router.navigate(['/user/' + currentUserId + '/category/'
                      + currentCategoryId + '/meter/' + this.meter.id + '/indicator']);
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
    if (this.getIndicatorByIdSubscription) {
      this.getIndicatorByIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.deleteIndicatorSubscription) {
      this.deleteIndicatorSubscription.unsubscribe();
    }
  }
}
