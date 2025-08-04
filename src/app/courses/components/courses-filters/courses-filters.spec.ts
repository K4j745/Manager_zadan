import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesFilters } from './courses-filters';

describe('CoursesFilters', () => {
  let component: CoursesFilters;
  let fixture: ComponentFixture<CoursesFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
