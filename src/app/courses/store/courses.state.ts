// src/app/courses/store/courses.state.ts
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Course, CourseFilters } from '../models/course-interface';
import { CoursesService } from '../../services/courses.service';
import { tap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
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
    filters: {
      searchTerm: '',
      tags: [],
      sortBy: 'publishedDate',
      sortDirection: 'desc',
    },
    loading: false,
    error: null,
  },
})
@Injectable()
export class CoursesState {
  constructor(private coursesService: CoursesService) {}

  @Selector()
  static getCourses(state: CoursesStateModel): Course[] {
    return state?.courses || [];
  }

  @Selector()
  static getSelectedCourse(state: CoursesStateModel): Course | null {
    return state?.selectedCourse || null;
  }

  @Selector()
  static getFilters(state: CoursesStateModel): CourseFilters {
    return (
      state?.filters || {
        searchTerm: '',
        category: undefined,
        difficulty: undefined,
        tags: [],
        sortBy: 'publishedDate',
        sortDirection: 'desc',
      }
    );
  }

  @Selector()
  static getFilteredCourses(state: CoursesStateModel): Course[] {
    console.log('[STATE] getFilteredCourses called', state);

    if (!state?.courses?.length) {
      console.log('[STATE] No courses available');
      return [];
    }

    const filters = state.filters || {};
    let filteredCourses = [...state.courses];

    console.log('[STATE] Starting with courses:', filteredCourses.length);

    if (filters.category) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category === filters.category
      );
      console.log('[STATE] After category filter:', filteredCourses.length);
    }

    if (filters.difficulty) {
      filteredCourses = filteredCourses.filter(
        (course) => course.difficulty === filters.difficulty
      );
      console.log('[STATE] After difficulty filter:', filteredCourses.length);
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          (course.tags || []).some((tag) =>
            tag.toLowerCase().includes(searchTerm)
          )
      );
      console.log('[STATE] After search filter:', filteredCourses.length);
    }

    if (filters.tags?.length) {
      filteredCourses = filteredCourses.filter((course) =>
        filters.tags!.some((filterTag) =>
          (course.tags || []).some((courseTag) =>
            courseTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
      console.log('[STATE] After tags filter:', filteredCourses.length);
    }

    // Sortowanie
    if (filters.sortBy) {
      filteredCourses.sort((a, b) => {
        const direction = filters.sortDirection === 'desc' ? -1 : 1;

        const getValue = (course: Course) => {
          switch (filters.sortBy) {
            case 'publishedDate':
              return new Date(course.publishedDate).getTime();
            case 'rating':
              return course.rating || 0;
            case 'studentsCount':
              return course.studentsCount || 0;
            case 'title':
              return course.title.toLowerCase();
            default:
              return 0;
          }
        };

        const aValue = getValue(a);
        const bValue = getValue(b);

        return aValue > bValue ? direction : -direction;
      });
    }

    console.log('[STATE] Final filtered courses:', filteredCourses.length);
    return filteredCourses;
  }

  @Selector()
  static isLoading(state: CoursesStateModel): boolean {
    const loading = state?.loading || false;
    console.log('[STATE] isLoading:', loading);
    return loading;
  }

  @Selector()
  static getError(state: CoursesStateModel): string | null {
    return state?.error || null;
  }

  @Action(LoadCourses)
  loadCourses(ctx: StateContext<CoursesStateModel>) {
    console.log('[STATE] LoadCourses action dispatched');

    ctx.patchState({
      loading: true,
      error: null,
    });

    return this.coursesService.getCourses().pipe(
      tap((courses) => {
        console.log('[STATE] Courses loaded from service:', courses);
        ctx.dispatch(new LoadCoursesSuccess(courses || []));
      }),
      catchError((error) => {
        console.error('[STATE] Error loading courses:', error);
        ctx.dispatch(new LoadCoursesError(error.message || 'Unknown error'));
        return throwError(() => error);
      })
    );
  }

  @Action(LoadCoursesSuccess)
  loadCoursesSuccess(
    ctx: StateContext<CoursesStateModel>,
    action: LoadCoursesSuccess
  ) {
    console.log(
      '[STATE] LoadCoursesSuccess:',
      action.courses.length,
      'courses'
    );

    ctx.patchState({
      courses: action.courses || [],
      loading: false,
      error: null,
    });
  }

  @Action(LoadCoursesError)
  loadCoursesError(
    ctx: StateContext<CoursesStateModel>,
    action: LoadCoursesError
  ) {
    console.error('[STATE] LoadCoursesError:', action.error);

    ctx.patchState({
      loading: false,
      error: action.error || 'Failed to load courses',
      courses: [],
    });
  }

  @Action(LoadCourseById)
  loadCourseById(ctx: StateContext<CoursesStateModel>, action: LoadCourseById) {
    const state = ctx.getState();
    const course = state.courses.find((c) => c.id === action.id);

    if (course) {
      ctx.patchState({ selectedCourse: course });
      return of(undefined);
    }

    ctx.patchState({ loading: true, error: null });

    return this.coursesService.getCourseById(action.id).pipe(
      tap((course) => {
        if (!course) {
          throw new Error('Course not found');
        }

        const updatedCourses = [...state.courses, course];

        ctx.patchState({
          courses: updatedCourses,
          selectedCourse: course,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          error: error.message,
          loading: false,
        });
        return throwError(() => error);
      })
    );
  }

  @Action(SetFilters)
  setFilters(ctx: StateContext<CoursesStateModel>, action: SetFilters) {
    console.log('[STATE] SetFilters:', action.filters);

    ctx.patchState({
      filters: {
        ...ctx.getState().filters,
        ...(action.filters || {}),
      },
    });
  }

  @Action(ClearFilters)
  clearFilters(ctx: StateContext<CoursesStateModel>) {
    ctx.patchState({
      filters: {
        searchTerm: '',
        tags: [],
        sortBy: 'publishedDate',
        sortDirection: 'desc',
      },
    });
  }
}
