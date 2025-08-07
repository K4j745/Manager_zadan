import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video } from '../../models/course-interface';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { HoverEffectDirective } from '../../directives/hover-effect.directive';

@Component({
  selector: 'app-video-player',
  imports: [MatIconModule, MatChipsModule, CommonModule],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer implements OnChanges {
  @Input() videos: Video[] | null = null;
  @Input() sectionId!: string;

  sectionVideos: Video[] = [];
  selectedVideo: Video | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videos'] || changes['sectionId']) {
      this.filterVideosBySection();
    }
  }

  private filterVideosBySection(): void {
    if (this.videos && this.sectionId) {
      this.sectionVideos = this.videos
        .filter((video) => video.sectionId === this.sectionId)
        .sort((a, b) => a.order - b.order);

      // Auto-select first video
      if (this.sectionVideos.length > 0 && !this.selectedVideo) {
        this.selectVideo(this.sectionVideos[0]);
      }
    }
  }

  selectVideo(video: Video): void {
    this.selectedVideo = video;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      video.url
    );
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  trackByVideoId(index: number, video: Video): string {
    return video.id;
  }
}
