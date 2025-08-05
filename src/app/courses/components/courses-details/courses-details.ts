import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { takeUntil, switchMap, filter, catchError, tap } from 'rxjs/operators';
import { Course, Video, PdfDocument } from '../../models/course-interface'; // Upewnij się, że to poprawna ścieżka
import { CoursesState } from '../../store/courses.state';
import { LoadCourseById } from '../../store/courses.actions';
import { VideoService } from '../../../services/video.service';
import { PdfService } from '../../../services/pdf.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { DifficultyColorPipe } from '../../pipes/difficulty-color.pipe';
import { PdfViewer } from '../pdf-viewer/pdf-viewer';
import { VideoPlayer } from '../video-player/video-player';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-courses-details',
  templateUrl: './courses-details.html',
  styleUrls: ['./courses-details.scss'],
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    PdfViewer,
    VideoPlayer,
    DifficultyColorPipe,
  ],
})
export class CoursesDetails implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activeSection = 'introduction';

  course$: Observable<Course | null>;
  videos$ = new BehaviorSubject<Video[]>([]); // Zmienione na BehaviorSubject
  pdfs$ = new BehaviorSubject<PdfDocument[]>([]); // Zmienione na BehaviorSubject
  loading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private videoService: VideoService,
    private pdfService: PdfService
  ) {
    this.course$ = this.store.select(CoursesState.getSelectedCourse);
    this.loading$ = this.store.select(CoursesState.isLoading);

    // Debugowanie
    this.course$.pipe(takeUntil(this.destroy$)).subscribe((course) => {
      console.log('[DEBUG] Current course:', course);
    });
  }

  ngOnInit(): void {
    console.log(
      '[DEBUG] Initializing component with route params:',
      this.route.snapshot.params
    );

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        filter((params) => !!params['id']),
        tap((params) =>
          console.log('[DEBUG] Processing course ID:', params['id'])
        ),
        switchMap((params) => {
          const courseId = params['id'];

          // Najpierw dispatch akcji i poczekaj na jej zakończenie
          return this.store.dispatch(new LoadCourseById(courseId)).pipe(
            // Po zakończeniu dispatch, pobierz dane
            switchMap(() =>
              combineLatest([
                this.videoService.getVideosByCourseId(courseId).pipe(
                  catchError((err) => {
                    console.error('[ERROR] Failed to load videos:', err);
                    return of([]);
                  })
                ),
                this.pdfService.getPdfsByCourseId(courseId).pipe(
                  catchError((err) => {
                    console.error('[ERROR] Failed to load PDFs:', err);
                    return of([]);
                  })
                ),
                this.store.selectOnce(CoursesState.getSelectedCourse), // Pobierz aktualny kurs
              ])
            )
          );
        })
      )
      .subscribe({
        next: ([videos, pdfs, course]) => {
          console.log('[DEBUG] Loaded data:', { course, videos, pdfs });
          this.videos$.next(videos);
          this.pdfs$.next(pdfs);
        },
        error: (err) =>
          console.error('[ERROR] Failed to load course data:', err),
      });

    // Obsługa fragmentów URL
    this.route.fragment
      .pipe(
        takeUntil(this.destroy$),
        filter((fragment): fragment is string => !!fragment)
      )
      .subscribe((fragment) => {
        this.activeSection = fragment;
        this.scrollToSection(fragment);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToSection(anchor: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: anchor,
      replaceUrl: true,
    });
  }

  private scrollToSection(anchor: string): void {
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
