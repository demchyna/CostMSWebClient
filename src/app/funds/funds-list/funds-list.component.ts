import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {UserService} from '../../user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import Funds, {FundsType} from '../../models/Funds';
import {FundsService} from '../funds.service';
import {Subscription} from 'rxjs';
import User from '../../models/User';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {changeDateFormat} from '../../helpers/date-format-helper';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-funds-list',
  templateUrl: './funds-list.component.html',
  styleUrls: ['./funds-list.component.css']
})
export class FundsListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getUserByIdSubscription: Subscription;
  getFundsByUserIdSubscription: Subscription;
  getFundsByIdSubscription: Subscription;
  deleteFundsSubscription: Subscription;

  user: User = new User();
  userId: number;
  funds: Funds[] = [];
  fundsDateValue = '';
  fundsCostValue = '';
  fundsSourceValue = '';
  fundsTypeValues = [FundsType.INCOME, FundsType.OUTLAY];
  fundsType = FundsType;
  order = 'date';
  reverse = true;
  currentPage = 1;
  itemsNumber = 10;
  maxIntegerValue = Number.MAX_SAFE_INTEGER;
  dateFormatter = changeDateFormat;
  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private fundsService: FundsService,
              public userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private breadcrumbService: BreadcrumbService) {  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.userId = params['id'];
      this.getFundsByUserIdSubscription = this.fundsService.getFundsByUserId(this.userId)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            response.body.forEach((item) => {
              this.funds.push(new Funds(
                item.id, item.date, item.source, item.value, item.currency, FundsType[<string>item.type], item.description
              ));
            });
            this.breadcrumbService.addFriendlyNameForRouteRegex('/user/[0-9]+/funds$', 'Доходи та витрати');
            this.getUserByIdSubscription = this.userService.getUserById(this.userId)
              .subscribe((userResp: HttpResponse<any>) => {
                if (userResp) {
                  tokenSetter(userResp);
                  this.user = userResp.body;
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

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  filterApply(filterDropdown: NgbDropdown, incomeItem, outlayItem) {
    filterDropdown.close();
    this.fundsTypeValues = [];
    if (incomeItem.checked) {
      this.fundsTypeValues.push(FundsType.INCOME);
    }
    if (outlayItem.checked) {
      this.fundsTypeValues.push(FundsType.OUTLAY);
    }
  }

  addIncomeFunds() {
    this.router.navigate([this.router.url + '/create'], { queryParams: { type: FundsType[FundsType.INCOME] } });
  }

  addOutlayFunds() {
    this.router.navigate([this.router.url + '/create'], { queryParams: { type: FundsType[FundsType.OUTLAY] } });
  }

  editFunds(fundsId: number, $event) {
    $event.stopPropagation();
    this.router.navigate([this.router.url + '/' + fundsId + '/update']);
  }

  deleteFunds(fundsId: number, $event) {
    $event.stopPropagation();
    this.getFundsByIdSubscription = this.fundsService.getFundsById(fundsId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const funds = response.body;
          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити даний запис"?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.deleteFundsSubscription = this.fundsService.deleteFunds(funds)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
                      this.router.navigate(['/user/' + this.userId + '/funds']));
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

  showFundsStatistic() {
    this.router.navigate(['/user/' + this.userId + '/funds/statistic']);
  }

  clickEvent($event) {
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.getFundsByUserIdSubscription) {
      this.getFundsByUserIdSubscription.unsubscribe();
    }
    if (this.getFundsByIdSubscription) {
      this.getFundsByIdSubscription.unsubscribe();
    }
    if (this.deleteFundsSubscription) {
      this.deleteFundsSubscription.unsubscribe();
    }
  }

}
