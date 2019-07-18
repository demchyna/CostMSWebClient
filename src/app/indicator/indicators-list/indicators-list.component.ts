import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IndicatorService} from '../indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Indicator from '../../models/Indicator';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs';
import {OrderPipe} from 'ngx-order-pipe';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {changeDateFormat} from '../../helpers/date-format-helper';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.css'],
})
export class IndicatorsListComponent implements OnInit, OnChanges, OnDestroy {

  getIndicatorByMeterIdSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getIndicatorByIdSubscription: Subscription;
  deleteIndicatorSubscription: Subscription;

  @Input() meterProps: Meter;
  indicators: Indicator[] = [];
  indicatorDateValue = '';
  tariffRateValue = '';
  indicatorPriceValue = '';
  indicatorPaymentValue = '';
  indicatorStatusValue = '';
  indicatorCurrentValue = '';
  order = 'date';
  reverse = true;
  currentPage = 1;
  itemsNumber = 10;
  maxIntegerValue = Number.MAX_SAFE_INTEGER;
  sortedIndicators: Indicator[] = [];

  dateFormatter = changeDateFormat;

  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private indicatorService: IndicatorService,
              private router: Router,
              private route: ActivatedRoute,
              private orderPipe: OrderPipe,
              private spinnerService: Ng4LoadingSpinnerService,
              private dialog: MatDialog) {

    this.sortedIndicators = orderPipe.transform(this.indicators, 'date');
  }

  ngOnInit() {
    this.spinnerService.show();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['meterProps'] && this.meterProps.id !== undefined) {
      this.getIndicatorByMeterIdSubscription = this.indicatorService.getIndicatorByMeterId(this.meterProps.id)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.indicators = response.body;
          }
          this.spinnerService.hide();
        }, (appError: AppError) => {
          throw appError;
        });
    }
  }

  getFullIndicators(): Indicator[] {
    let diff = 0;
    this.indicators.forEach((value, index) => {
      diff = diff - value.price + value.payment;
      value.status = diff;
    });
    return this.indicators;
  }

  addIndicator() {
    this.router.navigate([this.router.url + '/create']);
  }

  selectedRow(indicatorId: number) {
    this.router.navigate([this.router.url + '/' + indicatorId + '/info']);
  }

  editIndicator(indicatorId: number, $event) {
    $event.stopPropagation();
    this.router.navigate([this.router.url + '/' + indicatorId + '/update']);
  }

  deleteIndicator(indicatorId: number, $event) {
    $event.stopPropagation();

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
                    const currentRoute = this.router.url;
                    this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
                      this.router.navigate([currentRoute]));
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

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  clickEvent($event) {
    $event.stopPropagation();
  }

  getFormattedStatus(status: number): string {
    return Math.abs(status).toFixed(2);
  }

  ngOnDestroy(): void {
    if (this.getIndicatorByMeterIdSubscription) {
      this.getIndicatorByMeterIdSubscription.unsubscribe();
    }
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getIndicatorByIdSubscription) {
      this.getIndicatorByIdSubscription.unsubscribe();
    }
    if (this.deleteIndicatorSubscription) {
      this.deleteIndicatorSubscription.unsubscribe();
    }
  }
}
