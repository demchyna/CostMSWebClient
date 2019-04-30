import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterUpdateComponent } from './meter-update.component';

describe('MeterUpdateComponent', () => {
  let component: MeterUpdateComponent;
  let fixture: ComponentFixture<MeterUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
