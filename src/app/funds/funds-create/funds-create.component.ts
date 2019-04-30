import {Component, OnDestroy, OnInit} from '@angular/core';
import {FundsService} from '../funds.service';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import ValidationError from '../../models/ValidationError';
import {Subscription} from 'rxjs';
import Funds, {FundsType} from '../../models/Funds';

@Component({
  selector: 'app-funds-create',
  templateUrl: './funds-create.component.html',
  styleUrls: ['./funds-create.component.css']
})
export class FundsCreateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;
  createFundsSubscription: Subscription;

  fundsType = FundsType;
  type: FundsType;

  fundsErrors: Map<string, string> = new Map<string, string>();

  constructor(private fundsService: FundsService,
              public userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams
      .subscribe(queryParams => {
        this.type = FundsType[<string>queryParams['type']];
      });
  }

  createFunds(data: any): void {
    this.paramsSubscription = this.route.params.subscribe( params => {

      const funds = new Funds();

      funds.date = data.date;
      funds.source = data.source;
      funds.value = data.value;
      funds.currency = data.currency;
      funds.description = data.description;
      funds.userId = params['id'];
      funds.type = this.type;

      this.createFundsSubscription = this.fundsService.createFunds(funds)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            this.router.navigate(['/funds/user/' + params['id']]);
          }
        }, (appError: AppError) => {
          if (appError.status === 422) {
            this.fundsErrors = (<ValidationError>appError.error).validationErrors;
          } else {
            throw appError;
          }
        });
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.createFundsSubscription) {
      this.createFundsSubscription.unsubscribe();
    }
  }

}
