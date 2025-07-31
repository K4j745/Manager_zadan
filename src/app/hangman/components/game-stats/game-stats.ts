import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-stats.html',
  styleUrl: './game-stats.scss',
})
export class GameStats {
  @Input() level: number = 1;
  @Input() remainingTries: number = 6;
  @Input() maxTries: number = 6;
  @Input() elapsedTime: number = 0;

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  getTriesArray(): number[] {
    return Array(this.maxTries).fill(0);
  }
}
