// src/app/courses/store/courses.state.ts
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Course, CourseFilters } from '../models/course-interface';
import { CoursesService } from '../../services/courses.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  LoadCourses,
  LoadCoursesSuccess,
  LoadCoursesError,
  LoadCourseById,
  SetFilters,
  ClearFilters,
} from './courses.actions';

export interface CoursesStateModel {
  courses: Course[];
  selectedCourse: Course | null;
  filters: CourseFilters;
  loading: boolean;
  error: string | null;
}

@State<CoursesStateModel>({
  name: 'courses',
  defaults: {
    courses: [],
    selectedCourse: null,
    filters: {},
    loading: false,
    error: null,
  },
})
@Injectable()
export class CoursesState {
  constructor(private coursesService: CoursesService) {}

  @Selector()
  static getCourses(state: CoursesStateModel): Course[] {
    return state.courses;
  }

  @Selector()
  static getSelectedCourse(state: CoursesStateModel): Course | null {
    return state.selectedCourse;
  }

  @Selector()
  static getFilters(state: CoursesStateModel): CourseFilters {
    return state.filters;
  }

  @Selector()
  static getFilteredCourses(state: CoursesStateModel): Course[] {
    let filteredCourses = [...state.courses];

    if (state.filters.category) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === state.filters.category
      );
    }

    if (state.filters.difficulty) {
      filteredCourses = filteredCourses.filter(
        (course) => course.difficulty === state.filters.difficulty
      );
    }

    if (state.filters.searchTerm) {
      const searchTerm = state.filters.searchTerm.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (state.filters.tags && state.filters.tags.length > 0) {
      filteredCourses = filteredCourses.filter((course) =>
        state.filters.tags!.some((filterTag) =>
          course.tags.some((courseTag) =>
            courseTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Sortowanie
    if (state.filters.sortBy) {
      filteredCourses.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (state.filters.sortBy) {
          case 'publishedDate':
            aValue = new Date(a.publishedDate);
            bValue = new Date(b.publishedDate);
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'studentsCount':
            aValue = a.studentsCount;
            bValue = b.studentsCount;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            return 0;
        }

        if (state.filters.sortDirection === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filteredCourses;
  }

  @Selector()
  static isLoading(state: CoursesStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: CoursesStateModel): string | null {
    return state.error;
  }

  @Action(LoadCourses)
  loadCourses(ctx: StateContext<CoursesStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.coursesService.getCourses().pipe(
      tap((courses) => {
        ctx.dispatch(new LoadCoursesSuccess(courses));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadCoursesError(error.message));
        return of([]);
      })
    );
  }

  @Action(LoadCoursesSuccess)
  loadCoursesSuccess(
    ctx: StateContext<CoursesStateModel>,
    action: LoadCoursesSuccess
  ) {
    ctx.patchState({
      courses: action.courses,
      loading: false,
      error: null,
    });
  }

  @Action(LoadCoursesError)
  loadCoursesError(
    ctx: StateContext<CoursesStateModel>,
    action: LoadCoursesError
  ) {
    ctx.patchState({
      loading: false,
      error: action.error,
    });
  }

  @Action(LoadCourseById)
  loadCourseById(ctx: StateContext<CoursesStateModel>, action: LoadCourseById) {
    const state = ctx.getState();
    const course = state.courses.find((c) => c.id === action.id);

    if (course) {
      ctx.patchState({ selectedCourse: course });
      return of(undefined); // Zwracamy Observable<void>
    } else {
      return this.coursesService.getCourseById(action.id).pipe(
        tap((course) => {
          ctx.patchState({ selectedCourse: course });
        })
      );
    }
  }

  @Action(SetFilters)
  setFilters(ctx: StateContext<CoursesStateModel>, action: SetFilters) {
    ctx.patchState({ filters: action.filters });
  }

  @Action(ClearFilters)
  clearFilters(ctx: StateContext<CoursesStateModel>) {
    ctx.patchState({ filters: {} });
  }
}
