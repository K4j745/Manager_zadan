import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GameOver } from '../game-over/game-over';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  HangmanGameState,
  HangmanGameActions,
} from '../../state/hangman-game.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-game-level',
  imports: [CommonModule, MatButtonModule, RouterLink, RouterModule],
  templateUrl: './game-level.html',
  styleUrl: './game-level.scss',
})
export class GameLevel implements OnInit, OnDestroy {
  currentLevel$: Observable<any>;
  isGameFinished$: Observable<boolean>;

  wrongGuesses = 0;
  guessedLetters: string[] = [];
  alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  currentWord = '';
  level = 1;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store, private router: Router) {
    this.currentLevel$ = this.store.select(HangmanGameState.getCurrentLevel);
    this.isGameFinished$ = this.store.select(HangmanGameState.isGameFinished);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.currentLevel$.subscribe((level) => {
        this.currentWord = level.targetWord.toUpperCase();
        this.level = level.level;
        if (level.isCompleted && this.level < 5) {
          this.store.dispatch(new HangmanGameActions.AdvanceLevel());
        }
      }),

      this.isGameFinished$.subscribe((finished) => {
        if (finished) {
          this.navigateToGameOver();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onLetterClick(letter: string) {
    if (!this.guessedLetters.includes(letter)) {
      this.guessedLetters.push(letter);
      this.store.dispatch(new HangmanGameActions.GuessLetter(letter));

      if (!this.currentWord.includes(letter)) {
        this.wrongGuesses++;
        if (this.wrongGuesses >= 6) {
          this.navigateToGameOver();
        }
      }
    }
  }

  isLetterGuessed(letter: string): boolean {
    return this.guessedLetters.includes(letter);
  }

  get displayWord(): string {
    return this.currentWord
      .split('')
      .map((letter) => (this.guessedLetters.includes(letter) ? letter : '_'))
      .join(' ');
  }

  navigateToGameOver() {
    this.router.navigate(['/game-over']);
  }
}
