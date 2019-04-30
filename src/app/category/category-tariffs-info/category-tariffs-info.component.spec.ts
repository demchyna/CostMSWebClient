import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTariffsInfoComponent } from './category-tariffs-info.component';

describe('CategoryTariffsInfoComponent', () => {
  let component: CategoryTariffsInfoComponent;
  let fixture: ComponentFixture<CategoryTariffsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTariffsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTariffsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
