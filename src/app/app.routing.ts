import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {UserInfoComponent} from './user/user-info/user-info.component';
import {UserUpdateComponent} from './user/user-update/user-update.component';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {CategoriesListComponent} from './category/categories-list/categories-list.component';
import {MeterIndicatorsInfoComponent} from './meter/meter-indicators-info/meter-indicators-info.component';
import {IndicatorCreateComponent} from './indicator/indicator-create/indicator-create.component';
import {IndicatorUpdateComponent} from './indicator/indicator-update/indicator-update.component';
import {IndicatorInfoComponent} from './indicator/indicator-info/indicator-info.component';
import {CategoryCreateComponent} from './category/category-create/category-create.component';
import {CategoryUpdateComponent} from './category/category-update/category-update.component';
import {MeterCreateComponent} from './meter/meter-create/meter-create.component';
import {MeterInfoComponent} from './meter/meter-info/meter-info.component';
import {MeterUpdateComponent} from './meter/meter-update/meter-update.component';
import {TariffCreateComponent} from './tariff/tariff-create/tariff-create.component';
import {CategoryTariffsInfoComponent} from './category/category-tariffs-info/category-tariffs-info.component';
import {TariffInfoComponent} from './tariff/tariff-info/tariff-info.component';
import {TariffUpdateComponent} from './tariff/tariff-update/tariff-update.component';
import {AuthGuardService} from './guards/auth-guard/auth-guard.service';
import {AdminGuardService} from './guards/admin-guard/admin-guard.service';
import {CategoryInfoComponent} from './category/category-info/category-info.component';
import {UserCredentialComponent} from './user/user-credential/user-credential.component';
import {FundsListComponent} from './funds/funds-list/funds-list.component';
import {FundsCreateComponent} from './funds/funds-create/funds-create.component';
import {FundsUpdateComponent} from './funds/funds-update/funds-update.component';
import {FundsStatisticComponent} from './funds/funds-statistic/funds-statistic.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    redirectTo: 'login'
  },
  {
    path: 'registration',
    component: UserCreateComponent
  },
  {
    path: 'user/all',
    component: UsersListComponent,
    canActivate: [AuthGuardService, AdminGuardService]
  },
  {
    path: 'user/:id/info',
    component: UserInfoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user/:id/credential',
    component: UserCredentialComponent,
    canActivate: [AuthGuardService]

  },
  {
    path: 'user/:id/update',
    component: UserUpdateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user/:id/category',
    children: [
      {
        path: '',
        component: CategoriesListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'create',
        component: CategoryCreateComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: ':id/update',
        component: CategoryUpdateComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: ':id/info',
        component: CategoryInfoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: ':id/tariff',
        children: [
          {
            path: '',
            component: CategoryTariffsInfoComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: 'create',
            component: TariffCreateComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: ':id/update',
            component: TariffUpdateComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: ':id/info',
            component: TariffInfoComponent,
            canActivate: [AuthGuardService]
          },
        ]
      },
      {
        path: ':id/meter',
        children: [
          {
            path: 'create',
            component: MeterCreateComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: ':id/update',
            component: MeterUpdateComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: ':id/info',
            component: MeterInfoComponent,
            canActivate: [AuthGuardService]
          },
          {
            path: ':id/indicator',
            children: [
              {
                path: '',
                component: MeterIndicatorsInfoComponent,
                canActivate: [AuthGuardService],
              },
              {
                path: 'create',
                component: IndicatorCreateComponent,
                canActivate: [AuthGuardService]
              },
              {
                path: ':id/update',
                component: IndicatorUpdateComponent,
                canActivate: [AuthGuardService]
              },
              {
                path: ':id/info',
                component: IndicatorInfoComponent,
                canActivate: [AuthGuardService]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'funds/user/:id',
    component: FundsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'funds/create/user/:id',
    component: FundsCreateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'funds/:id/update',
    component: FundsUpdateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'funds/statistic/user/:id',
    component: FundsStatisticComponent,
    canActivate: [AuthGuardService]
  }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' });
