import { Component } from '@angular/core';
//import { CoursesFilters } from './components/courses-filters/courses-filters';
import { CoursesList } from './components/courses-list/courses-list';

@Component({
  selector: 'app-courses',
  imports: [CoursesList],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {}
