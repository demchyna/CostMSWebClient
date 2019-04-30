import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsCreateComponent } from './funds-create.component';

describe('FundsCreateComponent', () => {
  let component: FundsCreateComponent;
  let fixture: ComponentFixture<FundsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
