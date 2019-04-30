import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsStatisticComponent } from './funds-statistic.component';

describe('FundsStatisticComponent', () => {
  let component: FundsStatisticComponent;
  let fixture: ComponentFixture<FundsStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
