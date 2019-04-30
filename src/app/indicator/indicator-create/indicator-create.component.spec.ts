import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorCreateComponent } from './indicator-create.component';

describe('IndicatorCreateComponent', () => {
  let component: IndicatorCreateComponent;
  let fixture: ComponentFixture<IndicatorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
