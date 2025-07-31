import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-win-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './win-modal.html',
  styleUrl: './win-modal.scss',
})
export class WinModal {
  @Input() elapsedTime: number = 0;
  @Output() playAgain = new EventEmitter<void>();

  soulParticles = Array(15).fill(0);
  bonfireSparks = Array(8).fill(0);

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  onPlayAgain(): void {
    this.playAgain.emit();
  }

  onOverlayClick(event: Event): void {
    // Optional: close modal when clicking outside
    // this.playAgain.emit();
  }
}
