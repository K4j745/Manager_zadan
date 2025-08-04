import { Component } from '@angular/core';
import { CourseDetail } from './components/courses-details/courses-details';
import { CoursesFilters } from './components/courses-filters/courses-filters';
import { CoursesList } from './components/courses-list/courses-list';

@Component({
  selector: 'app-courses',
  imports: [CoursesList, CoursesFilters],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {}
