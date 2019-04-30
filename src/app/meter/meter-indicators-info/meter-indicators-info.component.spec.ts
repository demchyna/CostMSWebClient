import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterIndicatorsInfoComponent } from './meter-indicators-info.component';

describe('MeterIndicatorsInfoComponent', () => {
  let component: MeterIndicatorsInfoComponent;
  let fixture: ComponentFixture<MeterIndicatorsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterIndicatorsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterIndicatorsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
