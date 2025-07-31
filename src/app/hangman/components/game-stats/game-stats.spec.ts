import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStats } from './game-stats';

describe('GameStats', () => {
  let component: GameStats;
  let fixture: ComponentFixture<GameStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
