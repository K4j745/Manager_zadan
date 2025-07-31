import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-display.html',
  styleUrl: './word-display.scss',
})
export class WordDisplay {
  @Input() targetWord: string = '';
  @Input() guessedLetters: string[] = [];

  getDisplayLetters(): string[] {
    if (!this.targetWord) return [];

    return this.targetWord.split('').map((letter) => {
      return this.guessedLetters.includes(letter.toUpperCase()) ? letter : '_';
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
