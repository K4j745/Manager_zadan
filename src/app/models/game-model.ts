export interface CurrentLevel {
  level: number;
  targetWord: string;
  isCompleted: boolean;
}

export interface Attempt {
  letter: string;
  isCorrect: boolean;
}

export interface GameState {
  answersList: string[];
  randomWordsSet: string[];
  currentLevel: CurrentLevel;
  attempts: Attempt[];
  remainingTries: number;
  maxTries: number;
  gameStartTime: Date | null;
  elapsedTime: number;
  gameStatus: 'menu' | 'playing' | 'levelCompleted' | 'gameWon' | 'gameOver';
  completedLevels: number;
  maxLevels: number;
  lastFailedWord?: string;
}

export interface WordsData {
  answers: string[];
}
