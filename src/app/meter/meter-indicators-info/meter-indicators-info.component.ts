import {Component, OnDestroy, OnInit} from '@angular/core';
import {MeterService} from '../meter.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import Meter from '../../models/Meter';
import {Subscription} from 'rxjs';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-meter-indicators-info',
  templateUrl: './meter-indicators-info.component.html',
  styleUrls: ['./meter-indicators-info.component.css']
})
export class MeterIndicatorsInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getMeterByIdSubscription: Subscription;

  meter: Meter = new Meter();

  constructor(private meterService: MeterService,
              private route: ActivatedRoute,
              private router: Router,
              private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getMeterByIdSubscription = this.meterService.getMeterById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meter  = response.body;
            this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/meter/[0-9]+/indicator$', 'Лічильник "' + this.meter.name + '"');
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });
  }

  addIndicator() {
    this.router.navigate([this.router.url + '/create']);
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
  }
}
