import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
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
  videos$ = new BehaviorSubject<Video[]>([]);
  pdfs$ = new BehaviorSubject<PdfDocument[]>([]);

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
          return combineLatest([
            this.store.dispatch(new LoadCourseById(courseId)),
            this.videoService
              .getVideosByCourseId(courseId)
              .pipe(catchError(() => of([]))),
            this.pdfService
              .getPdfsByCourseId(courseId)
              .pipe(catchError(() => of([]))),
          ]);
        })
      )
      .subscribe({
        next: ([_, videos, pdfs]) => {
          this.videos$.next(videos);
          this.pdfs$.next(pdfs);
        },
        error: (err) => console.error('Error loading course:', err),
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

  hasCourseDetails(course: Course): boolean {
    return (
      !!course.category ||
      !!course.instructor ||
      !!course.tags?.length ||
      !!course.publishedDate
    );
  }

  hasSectionContent(section: any): boolean {
    return (
      !!section?.title &&
      (this.hasVideosForSection(section.id) ||
        this.hasPdfsForSection(section.id))
    );
  }

  hasVideosForSection(sectionId: string): boolean {
    const videos = this.videos$.value;
    return videos?.some((v) => v.sectionId === sectionId) ?? false;
  }

  hasPdfsForSection(sectionId: string): boolean {
    const pdfs = this.pdfs$.value;
    return pdfs?.some((p) => p.sectionId === sectionId) ?? false;
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
      document.getElementById(anchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
  onPdfError(error: any) {
    console.error('PDF loading error:', error);
  }
}
