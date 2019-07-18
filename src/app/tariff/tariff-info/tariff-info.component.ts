import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {tokenSetter} from '../../helpers/http-request-helper';
import AppError from '../../errors/app-error';
import {CategoryService} from '../../category/category.service';
import {TariffService} from '../tariff.service';
import {ActivatedRoute, Router} from '@angular/router';
import Tariff from '../../models/Tariff';
import Category from '../../models/Category';
import {Subscription} from 'rxjs';
import {changeDateFormat} from '../../helpers/date-format-helper';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmComponent} from '../../confirm/confirm.component';
import {BreadcrumbService} from 'ng5-breadcrumb';

@Component({
  selector: 'app-tariff-info',
  templateUrl: './tariff-info.component.html',
  styleUrls: ['./tariff-info.component.css']
})
export class TariffInfoComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  getTariffByIdSubscription: Subscription;
  getCategoryByIdSubscription: Subscription;
  deleteTariffSubscription: Subscription;

  dateFormatter = changeDateFormat;

  tariff: Tariff = new Tariff();
  category: Category = new Category();

  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private tariffService: TariffService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.getTariffByIdSubscription = this.tariffService.getTariffById(params['id'])
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.tariff = response.body;

            this.breadcrumbService.addFriendlyNameForRouteRegex('/.*/tariff/[0-9]+/info', this.tariff.name);

            this.getCategoryByIdSubscription = this.categoryService.getCategoryById(this.tariff.categoryId)
              .subscribe((categoryResp: HttpResponse<any>) => {
                if (categoryResp) {
                  tokenSetter(categoryResp);
                  this.category = categoryResp.body;
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

  editTariff(tariffId: number) {
    this.router.navigate([this.router.url.replace('info', 'update')]);
  }

  deleteTariff(tariffId: number) {
    this.getTariffByIdSubscription = this.tariffService.getTariffById(tariffId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const tariff = response.body;

          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити тариф з назвою "${tariff.name}"?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {

              this.deleteTariffSubscription = this.tariffService.deleteTariff(tariff)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    const currentUserId = this.router.url.split('/')[1];
                    this.router.navigate(['/user/' + currentUserId + '/category/' + this.category.id + '/tariff']);
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
    if (this.getTariffByIdSubscription) {
      this.getTariffByIdSubscription.unsubscribe();
    }
    if (this.getCategoryByIdSubscription) {
      this.getCategoryByIdSubscription.unsubscribe();
    }
    if (this.deleteTariffSubscription) {
      this.deleteTariffSubscription.unsubscribe();
    }
  }
}
