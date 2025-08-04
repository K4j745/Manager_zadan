// src/app/courses/pipes/difficulty-color.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyLevel } from '../models/course-interface';

@Pipe({
  name: 'difficultyColor',
  standalone: true,
})
export class DifficultyColorPipe implements PipeTransform {
  transform(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return '#4CAF50'; // Green
      case DifficultyLevel.INTERMEDIATE:
        return '#FF9800'; // Orange
      case DifficultyLevel.ADVANCED:
        return '#F44336'; // Red
      case DifficultyLevel.EXPERT:
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Grey
    }
  }
}
