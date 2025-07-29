import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HangmanGameService } from '../../services/hangman-game.service';

// State model
export interface HangmanGameStateModel {
  answersList: string[];
  randomWordsSet: string[];
  currentLevel: {
    level: number;
    targetWord: string;
    isCompleted: boolean;
  };
  attempts: {
    letter: string;
    isCorrect: boolean;
  }[];
  remainingTries: number;
  maxTries: number;
  gameStartTime: Date | null;
  elapsedTime: number | null;
  error: string | null;
}

// Actions
export namespace HangmanGameActions {
  export class StartNewGame {
    static readonly type = '[Hangman] Start New Game';
  }

  export class GuessLetter {
    static readonly type = '[Hangman] Guess Letter';
    constructor(public letter: string) {}
  }

  export class ResetGame {
    static readonly type = '[Hangman] Reset Game';
  }
  export class AdvanceLevel {
    static readonly type = '[Hangman] Advance Level';
  }

  export class FinishGame {
    static readonly type = '[Hangman] Finish Game';
  }

  export class InitializeGame {
    static readonly type = '[Hangman] Initialize Game';
  }
}

// Initial state
const defaultState: HangmanGameStateModel = {
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
  error: null,
};

@State<HangmanGameStateModel>({
  name: 'hangman',
  defaults: defaultState,
})
@Injectable()
export class HangmanGameState {
  constructor(private hangmanService: HangmanGameService) {}

  @Selector()
  static getCurrentLevel(state: HangmanGameStateModel) {
    return state.currentLevel;
  }

  @Selector()
  static getElapsedTime(state: HangmanGameStateModel) {
    return state.elapsedTime;
  }

  @Selector()
  static isGameFinished(state: HangmanGameStateModel) {
    return (
      state.remainingTries <= 0 ||
      (state.currentLevel.level === 5 && state.currentLevel.isCompleted)
    );
  }

  @Action(HangmanGameActions.StartNewGame)
  startNewGame(ctx: StateContext<HangmanGameStateModel>) {
    return this.hangmanService.initializeGame().pipe(
      tap(() => {
        const gameState = this.hangmanService.getGameState();
        ctx.patchState({
          ...gameState,
          error: null,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          error: 'Error starting new game: ' + error.message,
        });
        return throwError(() => error);
      })
    );
  }

  @Action(HangmanGameActions.GuessLetter)
  guessLetter(
    ctx: StateContext<HangmanGameStateModel>,
    action: HangmanGameActions.GuessLetter
  ) {
    const state = ctx.getState();

    if (this.hangmanService.isLetterUsed(action.letter)) {
      return;
    }

    this.hangmanService.processLetter(action.letter);
    const newState = this.hangmanService.getGameState();

    ctx.patchState({
      ...newState,
    });

    if (this.hangmanService.isGameOver() || this.hangmanService.isGameWon()) {
      return ctx.dispatch(new HangmanGameActions.FinishGame());
    }

    return;
  }

  @Action(HangmanGameActions.AdvanceLevel)
  advanceLevel(ctx: StateContext<HangmanGameStateModel>) {
    this.hangmanService.advanceLevel();
    const newState = this.hangmanService.getGameState();
    ctx.patchState({
      ...newState,
    });
  }

  @Action(HangmanGameActions.FinishGame)
  finishGame(ctx: StateContext<HangmanGameStateModel>) {
    this.hangmanService.finishGame();
    const finalState = this.hangmanService.getGameState();
    ctx.patchState({
      ...finalState,
    });
  }
}
