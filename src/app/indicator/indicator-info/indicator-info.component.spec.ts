import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorInfoComponent } from './indicator-info.component';

describe('IndicatorInfoComponent', () => {
  let component: IndicatorInfoComponent;
  let fixture: ComponentFixture<IndicatorInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
