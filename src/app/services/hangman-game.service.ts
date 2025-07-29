import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Answer,
  CurrentLevel,
  Attempt,
  GameState,
} from '../hangman-game/models/game-model';
@Injectable({
  providedIn: 'root',
})
export class HangmanGameService {
  private state: GameState = {
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
    elapsedTime: null,
  };

  constructor(private http: HttpClient) {}

  /**
   * Inicjalizuje nową grę
   */
  initializeGame(): Observable<void> {
    return this.loadAnswers().pipe(
      tap(() => {
        this.generateRandomWordsSet(5);
        this.resetGame();
      }),
      map(() => void 0)
    );
  }

  /**
   * Ładuje listę słów z pliku JSON
   */
  private loadAnswers(): Observable<string[]> {
    return this.http.get<Answer>('assets/hangman-game/answers.json').pipe(
      map((response) => response.answers),
      tap((answers) => {
        this.state.answersList = answers;
      })
    );
  }

  /**
   * Generuje zestaw słów do gry
   * @param count Liczba słów do wygenerowania
   */
  private generateRandomWordsSet(count: number): void {
    const shuffled = [...this.state.answersList].sort(
      () => 0.5 - Math.random()
    );
    this.state.randomWordsSet = shuffled.slice(0, count);
  }

  /**
   * Resetuje stan gry
   */
  private resetGame(): void {
    this.state.currentLevel = {
      level: 1,
      targetWord: this.state.randomWordsSet[0].toLowerCase(),
      isCompleted: false,
    };
    this.state.attempts = [];
    this.state.remainingTries = this.state.maxTries;
    this.state.gameStartTime = new Date();
    this.state.elapsedTime = null;
  }

  /**
   * Przetwarza wybór litery przez gracza
   * @param letter Wybrana litera
   */
  processLetter(letter: string): void {
    if (this.isLetterUsed(letter)) return;

    const attempt: Attempt = {
      letter: letter.toLowerCase(),
      isCorrect: this.state.currentLevel.targetWord.includes(
        letter.toLowerCase()
      ),
    };

    this.state.attempts.push(attempt);

    if (!attempt.isCorrect) {
      this.state.remainingTries--;
    }

    this.checkLevelCompletion();
  }

  /**
   * Sprawdza czy litera była już używana
   * @param letter Litera do sprawdzenia
   */
  isLetterUsed(letter: string): boolean {
    return this.state.attempts.some((a) => a.letter === letter.toLowerCase());
  }

  /**
   * Sprawdza czy aktualny poziom został ukończony
   */
  private checkLevelCompletion(): void {
    const uniqueLetters = [
      ...new Set(this.state.currentLevel.targetWord.replace(/[^a-z]/g, '')),
    ];
    const correctLetters = this.state.attempts
      .filter((a) => a.isCorrect)
      .map((a) => a.letter);

    this.state.currentLevel.isCompleted = uniqueLetters.every((letter) =>
      correctLetters.includes(letter)
    );
  }

  /**
   * Przechodzi do następnego poziomu
   */
  advanceLevel(): void {
    const nextLevel = this.state.currentLevel.level + 1;

    this.state.currentLevel = {
      level: nextLevel,
      targetWord: this.state.randomWordsSet[nextLevel - 1].toLowerCase(),
      isCompleted: false,
    };

    this.state.attempts = [];
    this.state.remainingTries = this.state.maxTries;
  }

  /**
   * Kończy grę i oblicza czas
   */
  finishGame(): void {
    if (this.state.gameStartTime) {
      this.state.elapsedTime =
        (new Date().getTime() - this.state.gameStartTime.getTime()) / 1000;
    }
  }

  // Metody dostępowe do stanu
  getCurrentLevel(): CurrentLevel {
    return { ...this.state.currentLevel };
  }

  getAttempts(): Attempt[] {
    return [...this.state.attempts];
  }

  getRemainingTries(): number {
    return this.state.remainingTries;
  }

  getGameState(): GameState {
    return { ...this.state };
  }

  isGameOver(): boolean {
    return this.state.remainingTries <= 0;
  }

  isGameWon(): boolean {
    return (
      this.state.currentLevel.level === 5 && this.state.currentLevel.isCompleted
    );
  }

  getElapsedTime(): number | null {
    return this.state.elapsedTime;
  }
}
