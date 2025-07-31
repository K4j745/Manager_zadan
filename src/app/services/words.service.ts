// src/app/hangman/services/words.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WordsData } from '../models/game-model';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private readonly wordsUrl = 'assets/words.json';

  constructor(private http: HttpClient) {}

  getWords(): Observable<WordsData> {
    return this.http.get<WordsData>(this.wordsUrl);
  }

  getRandomWordsSet(answersList: string[], setSize: number): string[] {
    if (setSize > answersList.length) {
      setSize = answersList.length;
    }

    const shuffled = [...answersList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, setSize);
  }
}
