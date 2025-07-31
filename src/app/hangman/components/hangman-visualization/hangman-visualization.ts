import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hangman-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hangman-visualization.html',
  styleUrl: './hangman-visualization.scss',
})
export class HangmanVisualization {
  @Input() wrongAttempts: number = 0;
}
