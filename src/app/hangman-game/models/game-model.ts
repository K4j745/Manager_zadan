// Model odpowiedzi z pliku JSON
export interface Answer {
  answers: string[];
}

// Model pojedynczego poziomu gry
export interface CurrentLevel {
  level: number; // Aktualny poziom (1-5)
  targetWord: string; // Słowo do odgadnięcia
  isCompleted: boolean; // Czy poziom ukończony
}

// Model próby zgadnięcia litery
export interface Attempt {
  letter: string; // Wybrana litera
  isCorrect: boolean; // Czy litera jest w słowie
}

// Główny model stanu gry
export interface GameState {
  answersList: string[]; // Pełna lista słów z pliku JSON
  randomWordsSet: string[]; // 5 wylosowanych słów do gry
  currentLevel: CurrentLevel; // Aktualny poziom
  attempts: Attempt[]; // Historia prób (używam liczby mnogiej dla czytelności)
  remainingTries: number; // Pozostałe próby (6 - błędne próby)
  maxTries: number; // Maksymalna liczba prób (6)
  gameStartTime: Date | null; // Czas rozpoczęcia gry
  elapsedTime: number | null; // Czas gry w sekundach (po zakończeniu)
}
