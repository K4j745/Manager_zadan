// src/app/courses/components/pdf-viewer/pdf-viewer.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PdfDocument } from '../../models/course-interface';
import { MatIconModule } from '@angular/material/icon';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pdf-viewer',
  imports: [MatIconModule, NgxExtendedPdfViewerModule, CommonModule],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss',
})
export class PdfViewer implements OnChanges {
  @Input() pdfs: PdfDocument[] | null = null;
  @Input() sectionId!: string;

  sectionPdfs: PdfDocument[] = [];
  selectedPdf: PdfDocument | null = null;
  showPdfViewer = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfs'] || changes['sectionId']) {
      this.filterPdfsBySection();
    }
  }

  private filterPdfsBySection(): void {
    if (this.pdfs && this.sectionId) {
      this.sectionPdfs = this.pdfs
        .filter((pdf) => pdf.sectionId === this.sectionId)
        .sort((a, b) => a.order - b.order);
    }
  }

  selectPdf(pdf: PdfDocument): void {
    this.selectedPdf = pdf;
    this.showPdfViewer = true;
  }

  closePdfViewer(): void {
    this.showPdfViewer = false;
    this.selectedPdf = null;
  }

  downloadPdf(pdf: PdfDocument): void {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = `${pdf.title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  trackByPdfId(index: number, pdf: PdfDocument): string {
    return pdf.id;
  }
}
