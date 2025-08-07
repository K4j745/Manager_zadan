import { Component } from '@angular/core';
//import { CoursesFilters } from './components/courses-filters/courses-filters';
import { CoursesList } from './components/courses-list/courses-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoursesFilters } from './components/courses-filters/courses-filters';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DifficultyColorPipe } from './pipes/difficulty-color.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-courses',
  imports: [
    CoursesList,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {}
