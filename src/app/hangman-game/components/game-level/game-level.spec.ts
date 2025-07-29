import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLevel } from './game-level';

describe('GameLevel', () => {
  let component: GameLevel;
  let fixture: ComponentFixture<GameLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
