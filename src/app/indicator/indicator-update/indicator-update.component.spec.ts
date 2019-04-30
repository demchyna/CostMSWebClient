import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorUpdateComponent } from './indicator-update.component';

describe('IndicatorUpdateComponent', () => {
  let component: IndicatorUpdateComponent;
  let fixture: ComponentFixture<IndicatorUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
