// src/app/courses/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Video } from '../courses/models/course-interface';
import { VideoData } from '../courses/models/video-interface';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'assets/data/videos.json';

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http
      .get<VideoData>(this.apiUrl)
      .pipe(map((response) => response.videos));
  }

  getVideosByCourseId(courseId: string): Observable<Video[]> {
    return this.getVideos().pipe(
      map((videos) => videos.filter((video) => video.courseId === courseId))
    );
  }

  getVideosBySectionId(sectionId: string): Observable<Video[]> {
    return this.getVideos().pipe(
      map((videos) => videos.filter((video) => video.sectionId === sectionId))
    );
  }
}
