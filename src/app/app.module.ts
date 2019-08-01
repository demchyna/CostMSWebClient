import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { CommonErrorHandler } from './errors/common-error-handler';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { CategoriesListComponent } from './category/categories-list/categories-list.component';
import { CategoryService } from './category/category.service';
import { MeterService } from './meter/meter.service';
import { MetersListComponent } from './meter/meters-list/meters-list.component';
import { MeterIndicatorsInfoComponent } from './meter/meter-indicators-info/meter-indicators-info.component';
import { IndicatorsListComponent } from './indicator/indicators-list/indicators-list.component';
import { IndicatorService } from './indicator/indicator.service';
import { IndicatorCreateComponent } from './indicator/indicator-create/indicator-create.component';
import { TariffService } from './tariff/tariff.service';
import { IndicatorUpdateComponent } from './indicator/indicator-update/indicator-update.component';
import { IndicatorInfoComponent } from './indicator/indicator-info/indicator-info.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryUpdateComponent } from './category/category-update/category-update.component';
import { MeterCreateComponent } from './meter/meter-create/meter-create.component';
import { MeterUpdateComponent } from './meter/meter-update/meter-update.component';
import { UnitService } from './unit/unit.service';
import { MeterInfoComponent } from './meter/meter-info/meter-info.component';
import { TariffCreateComponent } from './tariff/tariff-create/tariff-create.component';
import { TariffUpdateComponent } from './tariff/tariff-update/tariff-update.component';
import { TariffInfoComponent } from './tariff/tariff-info/tariff-info.component';
import { TariffsListComponent } from './tariff/tariffs-list/tariffs-list.component';
import { CategoryTariffsInfoComponent } from './category/category-tariffs-info/category-tariffs-info.component';
import { AuthGuardService } from './guards/auth-guard/auth-guard.service';
import { AdminGuardService } from './guards/admin-guard/admin-guard.service';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchFilterPipe } from './helpers/search-filter.pipe';
import { FundsFilterPipe} from './helpers/funds-filter.pipe';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule, MatCardModule, MatInputModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { CategoryInfoComponent } from './category/category-info/category-info.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserCredentialComponent } from './user/user-credential/user-credential.component';
import { FundsListComponent } from './funds/funds-list/funds-list.component';
import {FundsService} from './funds/funds.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FundsCreateComponent } from './funds/funds-create/funds-create.component';
import { FundsUpdateComponent } from './funds/funds-update/funds-update.component';
import { FundsStatisticComponent } from './funds/funds-statistic/funds-statistic.component';

import { ChartsModule } from 'ng2-charts';
import {appRouting} from './app.routing';
import {BreadcrumbService, Ng5BreadcrumbModule} from 'ng5-breadcrumb';

export function tokenGetter() {
  let jwtToken = '';
  if (sessionStorage.getItem('jwt-token')) {
    jwtToken = sessionStorage.getItem('jwt-token').substr(7);
  }
  return jwtToken;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsersListComponent,
    UserInfoComponent,
    UserUpdateComponent,
    UserCreateComponent,
    CategoriesListComponent,
    MetersListComponent,
    MeterIndicatorsInfoComponent,
    IndicatorsListComponent,
    IndicatorCreateComponent,
    IndicatorUpdateComponent,
    IndicatorInfoComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
    MeterCreateComponent,
    MeterUpdateComponent,
    MeterInfoComponent,
    TariffCreateComponent,
    TariffUpdateComponent,
    TariffInfoComponent,
    TariffsListComponent,
    CategoryTariffsInfoComponent,
    SearchFilterPipe,
    FundsFilterPipe,
    CategoryInfoComponent,
    UserCredentialComponent,
    ConfirmComponent,
    FundsListComponent,
    FundsCreateComponent,
    FundsUpdateComponent,
    FundsStatisticComponent
  ],
  entryComponents: [
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,

        // whitelistedDomains: ['localhost:8080'],
        whitelistedDomains: ['costms.herokuapp.com'],

        blacklistedRoutes: [''],
        skipWhenExpired: true
      }
    }),
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    NgbModule,
    ChartsModule,
    appRouting,
    OrderModule,
    NgxPaginationModule,
    Ng4LoadingSpinnerModule.forRoot(),
    Ng5BreadcrumbModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: CommonErrorHandler },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    UserService,
    RoleService,
    CategoryService,
    MeterService,
    IndicatorService,
    TariffService,
    UnitService,
    AuthGuardService,
    AdminGuardService,
    FundsService,
    BreadcrumbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {  }
