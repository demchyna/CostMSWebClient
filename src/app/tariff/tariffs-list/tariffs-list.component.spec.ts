import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffsListComponent } from './tariffs-list.component';

describe('TariffsListComponent', () => {
  let component: TariffsListComponent;
  let fixture: ComponentFixture<TariffsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TariffsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
