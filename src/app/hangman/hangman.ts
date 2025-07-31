import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../models/game-model';
import { GameStateService } from '../services/game-state.service';
import { WordsService } from '../services/words.service';
import { WordDisplay } from './components/word-display/word-display';
import { HangmanVisualization } from './components/hangman-visualization/hangman-visualization';
import { Keyboard } from './components/keyboard/keyboard';
import { GameStats } from './components/game-stats/game-stats';
import { WinModal } from './components/win-modal/win-modal';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [
    CommonModule,
    GameStats,
    WordDisplay,
    Keyboard,
    HangmanVisualization,
    WinModal,
  ],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export class Hangman implements OnInit, OnDestroy {
  gameState!: GameState;
  private destroy$ = new Subject<void>();

  constructor(
    private gameStateService: GameStateService,
    private wordsService: WordsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameStateService
      .getGameState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.gameState = state;

        if (state.gameStatus === 'gameOver') {
          this.router.navigate(['/hangman-game/game-over'], {
            state: { targetWord: this.gameState.currentLevel.targetWord },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setGameEnd(): void {
    this.gameState.gameStatus = 'gameWon';
  }
  startGame(): void {
    this.wordsService.getWords().subscribe((data) => {
      this.gameStateService.initializeGame(data.answers);
    });
  }

  onLetterSelected(letter: string): void {
    this.gameStateService.makeAttempt(letter);
  }

  nextLevel(): void {
    this.gameStateService.nextLevel();
  }

  playAgain(): void {
    this.gameStateService.resetGame();
  }

  getGuessedLetters(): string[] {
    return this.gameState.attempts
      .filter((attempt) => attempt.isCorrect)
      .map((attempt) => attempt.letter);
  }

  getUsedLetters(): string[] {
    return this.gameState.attempts.map((attempt) => attempt.letter);
  }

  getWrongAttempts(): number {
    return this.gameState.attempts.filter((attempt) => !attempt.isCorrect)
      .length;
  }
}
