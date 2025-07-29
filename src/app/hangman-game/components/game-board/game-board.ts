import { Component } from '@angular/core';
import { GameLevel } from '../game-level/game-level';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [GameLevel],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
})
export class GameBoard {}
