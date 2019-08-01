import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {FundsService} from '../funds.service';
import {UserService} from '../../user/user.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Label} from 'ng2-charts';
import {NgbDateStruct, NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-funds-statistic',
  templateUrl: './funds-statistic.component.html',
  styleUrls: ['./funds-statistic.component.css']
})
export class FundsStatisticComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getFundsByUserIdSubscription: Subscription;

  incomeData: any = [];
  outlayData: any = [];
  beginDateValue = '';
  endDateValue = '';

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          min: '',
          max: ''
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Сума, грн.',
          fontSize: 16
        }
      }],
    },
    tooltips: { }
  };

  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartLabels: Label[] = [];

  incomeValues = [];
  outlayValues = [];

  barChartData: ChartDataSets[] = [
    {
      data: this.incomeValues,
      label: 'Доходи',
      backgroundColor: 'rgba(33, 136, 56, 0.6)',
      hoverBackgroundColor: 'rgba(33, 136, 56, 0.8)',
      borderColor: 'rgba(33, 136, 56, 0.8)',
      hoverBorderColor: 'rgba(33, 136, 56, 0.8)'
    },
    {
      data: this.outlayValues,
      label: 'Витрати',
      backgroundColor: 'rgba(200, 35, 51, 0.6)',
      hoverBackgroundColor: 'rgba(200, 35, 51, 0.8)',
      borderColor: 'rgba(200, 35, 51, 0.8)',
      hoverBorderColor: 'rgba(200, 35, 51, 0.8)'
    }
  ];

  @ViewChild('baseChart') chart: BaseChartDirective;

  beginDate: NgbDateStruct;
  endDate: NgbDateStruct;
  beginMinDate: NgbDateStruct;
  beginMaxDate: NgbDateStruct;
  endMinDate: NgbDateStruct;
  endMaxDate: NgbDateStruct;

  constructor(private fundsService: FundsService,
              public userService: UserService,
              private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService) {  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      const userId = params['id'];
      this.getFundsByUserIdSubscription = this.fundsService.getFundsByUserId(userId)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/funds/statistic', 'Статистика');
            response.body.forEach((item) => {
              switch (item.type) {
                case 'INCOME':
                  this.incomeData.push([item.date, item.value]);
                  break;
                case 'OUTLAY':
                  this.outlayData.push([item.date, item.value]);
                  break;
                default:
                  alert('Error!');
              }
            });
            if (typeof this.incomeData !== 'undefined' && this.incomeData.length > 0) {
              this.incomeData.forEach((item, index) => {
                for (let i = index + 1; i < this.incomeData.length; i++) {
                  if (item[0] === this.incomeData[i][0]) {
                    item[1] = item[1] + this.incomeData[i][1];
                    this.incomeData.splice(i, 1);
                  }
                }
              });
              this.outlayData.forEach((item, index) => {
                for (let i = index + 1; i < this.outlayData.length; i++) {
                  if (item[0] === this.outlayData[i][0]) {
                    item[1] = item[1] + this.outlayData[i][1];
                    this.outlayData.splice(i, 1);
                  }
                }
              });
              this.incomeData.forEach((incomeItem) => {
                let equals = false;
                this.outlayData.forEach((outlayItem) => {
                  if (incomeItem[0] === outlayItem[0]) {
                    equals = true;
                  }
                });
                if (!equals) {
                  this.outlayData.push([incomeItem[0], null]);
                }
              });
              this.outlayData.forEach((outlayItem) => {
                let equals = false;
                this.incomeData.forEach((incomeItem) => {
                  if (outlayItem[0] === incomeItem[0]) {
                    equals = true;
                  }
                });
                if (!equals) {
                  this.incomeData.push([outlayItem[0], null]);
                }
              });
              this.incomeData.sort((a, b) => {
                return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
              });
              this.outlayData.sort((a, b) => {
                return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
              });
              this.incomeData.forEach((item) => {
                this.barChartLabels.push(item[0]);
                this.incomeValues.push(item[1]);
              });
              this.outlayData.forEach((item) => {
                this.outlayValues.push(item[1]);
              });
              this.beginDate = this.beginMinDate = this.endMinDate = this.getFormattedDate(this.incomeData[0][0].toString());
              this.endDate = this.beginMaxDate = this.endMaxDate = this.getFormattedDate(this.incomeData[this.incomeData.length - 1][0]
                .toString());
            }
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  filterApply(filterDropdown: NgbDropdown) {
    this.beginDateValue = this.getStringDate(this.beginDate);
    this.endDateValue = this.getStringDate(this.endDate);
    this.filterConfig(filterDropdown);
  }

  filterReset(filterDropdown: NgbDropdown) {
    this.beginDate = this.beginMinDate = this.endMinDate = this.getFormattedDate(this.incomeData[0][0].toString());
    this.endDate = this.beginMaxDate = this.endMaxDate = this.getFormattedDate(this.incomeData[this.incomeData.length - 1][0].toString());
    this.filterConfig(filterDropdown);
  }


  private filterConfig(filterDropdown: NgbDropdown) {
    filterDropdown.close();
    this.beginDateValue = this.getStringDate(this.beginDate);
    this.endDateValue = this.getStringDate(this.endDate);
    this.chart.chart.destroy();
    this.barChartOptions.scales.xAxes[0].ticks.min = this.beginDateValue;
    this.barChartOptions.scales.xAxes[0].ticks.max = this.endDateValue;
    const beginIncomeIndex = this.incomeData.findIndex(item => item[0] === this.beginDateValue);
    const endIncomeIndex = this.incomeData.findIndex(item => item[0] === this.endDateValue);
    const beginOutlayIndex = this.outlayData.findIndex(item => item[0] === this.beginDateValue);
    const endOutlayIndex = this.outlayData.findIndex(item => item[0] === this.endDateValue);
    const incomeData = this.incomeData.slice(beginIncomeIndex, endIncomeIndex + 1);
    const outlayData = this.outlayData.slice(beginOutlayIndex, endOutlayIndex + 1);
    const incomeValues = [];
    const outlayValues = [];
    incomeData.forEach((item) => {
      incomeValues.push(item[1]);
    });
    outlayData.forEach((item) => {
      outlayValues.push(item[1]);
    });
    this.barChartOptions.scales.yAxes[0].ticks.max = Math.max(Math.max(...incomeValues), Math.max(...outlayValues)) + 1;
    this.chart.ngOnInit();
  }

  private getStringDate(date: NgbDateStruct): string {
    const day = (date.day < 10) ? '0' + date.day : date.day;
    const month = (date.month < 10) ? '0' + date.month : date.month;
    return date.year + '-' + month + '-' + day;
  }

  private getFormattedDate(date: string): NgbDateStruct {
    const dateSegments = date.split('-');
    return {
      day: parseInt(dateSegments[2], 10),
      month: parseInt(dateSegments[1], 10),
      year: parseInt(dateSegments[0], 10)
    };
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getFundsByUserIdSubscription) {
      this.getFundsByUserIdSubscription.unsubscribe();
    }
  }
}
