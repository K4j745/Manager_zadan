import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDisplay } from './word-display';

describe('WordDisplay', () => {
  let component: WordDisplay;
  let fixture: ComponentFixture<WordDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
