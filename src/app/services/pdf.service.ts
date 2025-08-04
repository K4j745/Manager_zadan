// src/app/courses/services/pdf.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PdfDocument, PdfData } from '../courses/models/course-interface';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = 'assets/data/pdfs.json';

  constructor(private http: HttpClient) {}

  getPdfs(): Observable<PdfDocument[]> {
    return this.http
      .get<PdfData>(this.apiUrl)
      .pipe(map((response) => response.pdfs));
  }

  getPdfsByCourseId(courseId: string): Observable<PdfDocument[]> {
    return this.getPdfs().pipe(
      map((pdfs) => pdfs.filter((pdf) => pdf.courseId === courseId))
    );
  }

  getPdfsBySectionId(sectionId: string): Observable<PdfDocument[]> {
    return this.getPdfs().pipe(
      map((pdfs) => pdfs.filter((pdf) => pdf.sectionId === sectionId))
    );
  }
}
