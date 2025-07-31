import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.scss',
})
export class Keyboard {
  @Input() usedLetters: string[] = [];
  @Output() letterSelected = new EventEmitter<string>();

  keyboardLayout: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  selectLetter(letter: string): void {
    if (!this.isLetterUsed(letter)) {
      this.letterSelected.emit(letter);
      console.log(`Letter selected: ${letter}`);
    }
  }

  isLetterUsed(letter: string): boolean {
    return this.usedLetters.includes(letter);
  }
}
