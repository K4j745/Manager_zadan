import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../models/game-model';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-over.html',
  styleUrl: './game-over.scss',
})
export class GameOver implements OnInit, OnDestroy {
  gameState: any;
  correctWord: string = '';
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {
    // this.targetWord =
    //   this.router.getCurrentNavigation()?.extras.state?.['gameState']
    //     .currentLevel.targetWord || '';
  }
  ngOnInit(): void {
    this.gameStateService
      .getGameState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: GameState) => {
        this.correctWord = state.lastFailedWord || '';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetGame() {
    this.gameStateService.resetGame();
    this.router.navigate(['/hangman-game']);
  }
}
