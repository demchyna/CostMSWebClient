import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {MeterService} from '../meter.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitService} from '../../unit/unit.service';
import Unit from '../../models/Unit';
import {CategoryService} from '../../category/category.service';
import Category from '../../models/Category';
import Meter from '../../models/Meter';
import {UserService} from '../../user/user.service';
import {Subscription} from 'rxjs';
import ValidationError from '../../models/ValidationError';

@Component({
  selector: 'app-meter-create',
  templateUrl: './meter-create.component.html',
  styleUrls: ['./meter-create.component.css']
})
export class MeterCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  getAllUnitsSubscription: Subscription;
  createMeterSubscription: Subscription;

  category: Category = new Category();
  units: Unit[] = [];
  meterErrors: Map<string, string> = new Map<string, string>();

  constructor(private meterService: MeterService,
              private categoryService: CategoryService,
              private unitService: UnitService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getCategoryByIdSubscription = this.categoryService.getCategoryById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.category = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    });

    this.getAllUnitsSubscription = this.unitService.getAllUnits()
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.units = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  createMeter(data: any): void {
    const meter = new Meter();

    meter.name = data.name;
    meter.description = data.description;
    meter.categoryId = this.category.id;

    if (data.unit) {
      meter.unitId = data.unit.id;
    }

    meter.userId = this.category.userId;

    this.createMeterSubscription = this.meterService.createMeter(meter)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          this.router.navigate(['/category/user/' + this.category.userId]);
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
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.getAllUnitsSubscription) {
      this.getAllUnitsSubscription.unsubscribe();
    }
    if (this.createMeterSubscription) {
      this.createMeterSubscription.unsubscribe();
    }
  }
}
