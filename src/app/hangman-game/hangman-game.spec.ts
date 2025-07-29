import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangmanGame } from './hangman-game';

describe('HangmanGame', () => {
  let component: HangmanGame;
  let fixture: ComponentFixture<HangmanGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangmanGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangmanGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
