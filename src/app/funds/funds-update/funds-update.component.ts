import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import ValidationError from '../../models/ValidationError';
import Funds, {FundsType} from '../../models/Funds';
import {FundsService} from '../funds.service';

@Component({
  selector: 'app-funds-update',
  templateUrl: './funds-update.component.html',
  styleUrls: ['./funds-update.component.css']
})
export class FundsUpdateComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getFundsByIdSubscription: Subscription;
  updateFundsSubscription: Subscription;

  fundsType = FundsType;
  type: FundsType;

  funds: Funds = new Funds();
  private fundsId: number;
  fundsErrors: Map<string, string> = new Map<string, string>();

  constructor(private fundsService: FundsService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {

    this.paramsSubscription = this.route.params.subscribe( params => this.fundsId = params['id']);
  }

  ngOnInit() {
    this.getFundsByIdSubscription = this.fundsService.getFundsById(this.fundsId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.funds = response.body;
        }
      }, (appError: AppError) => {
        throw appError;
      });
  }

  updateFunds(data: any): void {

    this.funds.date = data.date;
    this.funds.source = data.source;
    this.funds.value = data.value;
    this.funds.currency = data.currency;
    this.funds.description = data.description;

    this.updateFundsSubscription = this.fundsService.updateFunds(this.funds)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          this.router.navigate(['/funds/user/' + this.funds.userId]);
        }
      }, (appError: AppError) => {
        if (appError.status === 422) {
          this.fundsErrors = (<ValidationError>appError.error).validationErrors;
        } else {
          throw appError;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getFundsByIdSubscription) {
      this.getFundsByIdSubscription.unsubscribe();
    }
    if (this.updateFundsSubscription) {
      this.updateFundsSubscription.unsubscribe();
    }
  }

}
