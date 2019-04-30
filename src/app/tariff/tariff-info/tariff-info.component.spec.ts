import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffInfoComponent } from './tariff-info.component';

describe('TariffInfoComponent', () => {
  let component: TariffInfoComponent;
  let fixture: ComponentFixture<TariffInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
