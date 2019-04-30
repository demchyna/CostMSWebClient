import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetersListComponent } from './meters-list.component';

describe('MetersListComponent', () => {
  let component: MetersListComponent;
  let fixture: ComponentFixture<MetersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
