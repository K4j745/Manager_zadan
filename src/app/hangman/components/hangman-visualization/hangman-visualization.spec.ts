import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangmanVisualization } from './hangman-visualization';

describe('HangmanVisualization', () => {
  let component: HangmanVisualization;
  let fixture: ComponentFixture<HangmanVisualization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangmanVisualization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangmanVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
