import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { HangmanGameActions } from '../../state/hangman-game.state';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-over.html',
  styleUrl: './game-over.scss',
})
export class GameOver {
  constructor(private store: Store, private router: Router) {}

  resetGame() {
    this.store.dispatch(new HangmanGameActions.StartNewGame());
    this.router.navigate(['/hangman-game']);
  }
}
