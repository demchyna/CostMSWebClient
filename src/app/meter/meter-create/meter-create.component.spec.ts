import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterCreateComponent } from './meter-create.component';

describe('MeterCreateComponent', () => {
  let component: MeterCreateComponent;
  let fixture: ComponentFixture<MeterCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
