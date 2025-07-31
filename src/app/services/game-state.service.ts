// src/app/hangman/services/game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { GameState, Attempt, CurrentLevel } from '../models/game-model';
import { WordsService } from './words.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private readonly initialState: GameState = {
    answersList: [],
    randomWordsSet: [],
    currentLevel: {
      level: 1,
      targetWord: '',
      isCompleted: false,
    },
    attempts: [],
    remainingTries: 6,
    maxTries: 6,
    gameStartTime: null,
    elapsedTime: 0,
    gameStatus: 'menu',
    completedLevels: 0,
    maxLevels: 5,
    lastFailedWord: undefined,
  };

  private gameState$ = new BehaviorSubject<GameState>(this.initialState);
  private timerSubscription: any;

  constructor(private wordsService: WordsService) {}

  getGameState(): Observable<GameState> {
    return this.gameState$.asObservable();
  }

  getCurrentState(): GameState {
    return this.gameState$.value;
  }

  initializeGame(words: string[]): void {
    const randomWordsSet = this.wordsService.getRandomWordsSet(words, 5);
    const newState: GameState = {
      ...this.initialState,
      answersList: words,
      randomWordsSet,
      currentLevel: {
        level: 1,
        targetWord: randomWordsSet[0],
        isCompleted: false,
      },
      gameStartTime: new Date(),
      gameStatus: 'playing',
    };

    this.gameState$.next(newState);
    this.startTimer();
  }

  makeAttempt(letter: string): void {
    const currentState = this.getCurrentState();
    const targetWord = currentState.currentLevel.targetWord;
    const isCorrect = targetWord.includes(letter.toUpperCase());

    const newAttempt: Attempt = {
      letter: letter.toUpperCase(),
      isCorrect,
    };

    const updatedAttempts = [...currentState.attempts, newAttempt];
    let updatedRemainingTries = currentState.remainingTries;

    if (!isCorrect) {
      updatedRemainingTries--;
    }

    // Check if word is completed
    const guessedLetters = updatedAttempts
      .filter((attempt) => attempt.isCorrect)
      .map((attempt) => attempt.letter);

    const isWordCompleted = targetWord
      .split('')
      .every((letter) => guessedLetters.includes(letter));

    let newGameStatus = currentState.gameStatus;
    let newLevel = currentState.currentLevel;
    let newCompletedLevels = currentState.completedLevels;

    if (isWordCompleted) {
      newCompletedLevels++;
      newLevel = { ...newLevel, isCompleted: true };

      if (newCompletedLevels >= currentState.maxLevels) {
        newGameStatus = 'gameWon';
        this.stopTimer();
      } else {
        newGameStatus = 'levelCompleted';
      }
    } else if (updatedRemainingTries <= 0) {
      newGameStatus = 'gameOver';
      this.stopTimer();
    }

    const updatedState: GameState = {
      ...currentState,
      attempts: updatedAttempts,
      remainingTries: updatedRemainingTries,
      currentLevel: newLevel,
      gameStatus: newGameStatus,
      completedLevels: newCompletedLevels,
      lastFailedWord:
        newGameStatus === 'gameOver' ? targetWord : currentState.lastFailedWord,
    };

    this.gameState$.next(updatedState);
  }

  nextLevel(): void {
    const currentState = this.getCurrentState();
    const nextLevelIndex = currentState.completedLevels;

    if (nextLevelIndex < currentState.randomWordsSet.length) {
      const updatedState: GameState = {
        ...currentState,
        currentLevel: {
          level: nextLevelIndex + 1,
          targetWord: currentState.randomWordsSet[nextLevelIndex],
          isCompleted: false,
        },
        attempts: [],
        remainingTries: currentState.maxTries,
        gameStatus: 'playing',
      };

      this.gameState$.next(updatedState);
    }
  }

  resetGame(): void {
    this.stopTimer();
    this.gameState$.next(this.initialState);
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      const currentState = this.getCurrentState();
      if (currentState.gameStartTime && currentState.gameStatus === 'playing') {
        const elapsed = Math.floor(
          (Date.now() - currentState.gameStartTime.getTime()) / 1000
        );
        this.gameState$.next({
          ...currentState,
          elapsedTime: elapsed,
        });
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
