import { Component, OnInit } from '@angular/core';
import { GameBoard } from './components/game-board/game-board';
import { HangmanGameActions } from './state/hangman-game.state';
import { Store } from '@ngxs/store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hangman-game',
  standalone: true,
  imports: [GameBoard, RouterModule],
  templateUrl: './hangman-game.html',
  styleUrl: './hangman-game.scss',
})
export class HangmanGame implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new HangmanGameActions.StartNewGame());
  }
}
