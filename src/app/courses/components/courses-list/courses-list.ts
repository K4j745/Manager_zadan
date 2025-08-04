import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course, CourseFilters } from '../../models/course-interface';
import { CoursesState } from '../../store/courses.state';
import { LoadCourses, SetFilters } from '../../store/courses.actions';
import { DifficultyColorPipe } from '../../pipes/difficulty-color.pipe';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CoursesFilters } from '../courses-filters/courses-filters';
import { HoverEffectDirective } from '../../directives/hover-effect.directive';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.html',
  styleUrls: ['./courses-list.scss'],
  standalone: true,
  imports: [
    DifficultyColorPipe,
    HoverEffectDirective,
    MatProgressBar,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    CoursesFilters,
  ],
})
export class CoursesList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  courses$!: Observable<Course[]>;
  loading$!: Observable<boolean>;
  filters$!: Observable<CourseFilters>;

  constructor(private store: Store, private router: Router) {
    this.initSelectors();
  }

  private initSelectors(): void {
    this.courses$ = this.store.select(CoursesState.getFilteredCourses);
    this.loading$ = this.store.select(CoursesState.isLoading);
    this.filters$ = this.store.select(CoursesState.getFilters);
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadCourses());

    this.courses$.pipe(takeUntil(this.destroy$)).subscribe((courses) => {
      console.log('Loaded courses:', courses);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCourseClick(courseId: string): void {
    this.router.navigate(['/courses', courseId]); // Fixed navigation
  }

  onFiltersChange(filters: CourseFilters): void {
    this.store.dispatch(new SetFilters(filters));
  }

  trackByCourseId(_index: number, course: Course): string {
    return course.id;
  }
}
