import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterInfoComponent } from './meter-info.component';

describe('MeterInfoComponent', () => {
  let component: MeterInfoComponent;
  let fixture: ComponentFixture<MeterInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
