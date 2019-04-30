import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import AppError from '../../errors/app-error';
import {tokenSetter} from '../../helpers/http-request-helper';
import {MeterService} from '../meter.service';
import Meter from '../../models/Meter';
import {UserService} from '../../user/user.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmComponent} from '../../confirm/confirm.component';

@Component({
  selector: 'app-meters-list',
  templateUrl: './meters-list.component.html',
  styleUrls: ['./meters-list.component.css']
})
export class MetersListComponent implements OnInit, OnChanges, OnDestroy {

  getMeterByCategoryIdSubscription: Subscription;
  getMeterByIdSubscription: Subscription;
  deleteMeterSubscription: Subscription;

  @Input() private categoryId: number;
  meters: Meter[];

  dialogRef: MatDialogRef<ConfirmComponent, any>;

  constructor(private meterService: MeterService, private userService: UserService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meters = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId !== undefined) {
      this.getMeterByCategoryIdSubscription = this.meterService.getMeterByCategoryId(this.categoryId)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            tokenSetter(response);
            this.meters = response.body;
          }
        }, (appError: AppError) => {
          throw appError;
        });
    }
  }

  selectedMeter(meterId: number) {
    this.router.navigate(['/meter/' + meterId + '/indicators/info']);
  }

  infoMeter(meterId: number, event) {
    event.stopPropagation();
    this.router.navigate(['/meter/' + meterId + '/info']);
  }

  editMeter(meterId: number, event) {
    event.stopPropagation();
    this.router.navigate(['/meter/' + meterId + '/update']);
  }

  deleteMeter(meterId: number, event) {
    event.stopPropagation();

    this.getMeterByIdSubscription = this.meterService.getMeterById(meterId)
      .subscribe((response: HttpResponse<any>) => {
        if (response) {
          tokenSetter(response);
          const meter = response.body;

          this.dialogRef = this.dialog.open(ConfirmComponent, {
            disableClose: true,
            autoFocus: false
          });
          this.dialogRef.componentInstance.confirmMessage = `Ви дійсно хоче видалити лічильник з назвою "${meter.name}"?`;
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {

              this.deleteMeterSubscription = this.meterService.deleteMeter(meter)
                .subscribe((deleteResp: HttpResponse<any>) => {
                  if (deleteResp) {
                    this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
                      this.router.navigate(['/category/user/' + this.categoryId]));
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
    if (this.getMeterByCategoryIdSubscription) {
      this.getMeterByCategoryIdSubscription.unsubscribe();
    }
    if (this.getMeterByIdSubscription) {
      this.getMeterByIdSubscription.unsubscribe();
    }
    if (this.deleteMeterSubscription) {
      this.deleteMeterSubscription.unsubscribe();
    }
  }
}
