// src/app/courses/services/courses.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../courses/models/course-interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'assets/data/courses.json';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<{ courses: Course[] }>(this.apiUrl).pipe(
      map((response) =>
        response.courses.map((course) => ({
          ...course,
          publishedDate: new Date(course.publishedDate),
        }))
      )
    );
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.getCourses().pipe(
      map((courses) => courses.find((course) => course.id === id))
    );
  }

  getCategories(): string[] {
    return [
      'frontend',
      'backend',
      'fullstack',
      'mobile',
      'devops',
      'data-science',
      'ui-ux',
    ];
  }

  getDifficultyLevels(): string[] {
    return ['beginner', 'intermediate', 'advanced', 'expert'];
  }
}
