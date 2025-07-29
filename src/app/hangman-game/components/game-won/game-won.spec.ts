import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWon } from './game-won';

describe('GameWon', () => {
  let component: GameWon;
  let fixture: ComponentFixture<GameWon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameWon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameWon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
