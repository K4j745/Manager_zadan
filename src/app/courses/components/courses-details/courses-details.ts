import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { takeUntil, switchMap, filter, catchError } from 'rxjs/operators';
import { Course, Video, PdfDocument } from '../../models/course-interface';
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

@Component({
  selector: 'app-courses-details',
  templateUrl: './courses-details.html',
  styleUrls: ['./courses-details.scss'],
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
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
  videos$ = new Subject<Video[]>();
  pdfs$ = new Subject<PdfDocument[]>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private videoService: VideoService,
    private pdfService: PdfService
  ) {
    this.course$ = this.store.select(CoursesState.getSelectedCourse);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        filter((params) => !!params['id']),
        switchMap((params) => {
          const courseId = params['id'];
          this.store.dispatch(new LoadCourseById(courseId));

          return combineLatest([
            this.videoService
              .getVideosByCourseId(courseId)
              .pipe(catchError(() => of([] as Video[]))),
            this.pdfService
              .getPdfsByCourseId(courseId)
              .pipe(catchError(() => of([] as PdfDocument[]))),
          ]);
        })
      )
      .subscribe({
        next: ([videos, pdfs]) => {
          this.videos$.next(videos || []);
          this.pdfs$.next(pdfs || []);
        },
        error: (err) => console.error('Error loading course data:', err),
      });

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
    this.activeSection = anchor;
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: anchor,
      replaceUrl: true,
    });
  }

  private scrollToSection(anchor: string): void {
    setTimeout(() => {
      const element = document.getElementById(anchor);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
