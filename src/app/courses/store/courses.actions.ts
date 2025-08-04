// src/app/courses/store/courses.actions.ts
import { Course, CourseFilters } from '../models/course-interface';

export class LoadCourses {
  static readonly type = '[Courses] Load Courses';
}

export class LoadCoursesSuccess {
  static readonly type = '[Courses] Load Courses Success';
  constructor(public courses: Course[]) {}
}

export class LoadCoursesError {
  static readonly type = '[Courses] Load Courses Error';
  constructor(public error: string) {}
}

export class LoadCourseById {
  static readonly type = '[Courses] Load Course By Id';
  constructor(public id: string) {}
}

export class SetFilters {
  static readonly type = '[Courses] Set Filters';
  constructor(public filters: CourseFilters) {}
}

export class ClearFilters {
  static readonly type = '[Courses] Clear Filters';
}
