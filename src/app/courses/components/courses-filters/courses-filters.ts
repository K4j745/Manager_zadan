import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CourseFilters } from '../../models/course-interface';
import { CoursesService } from '../../../services/courses.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-courses-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './courses-filters.html',
  styleUrls: ['./courses-filters.scss'],
})
export class CoursesFilters implements OnInit {
  @Output() filtersChange = new EventEmitter<CourseFilters>();

  filtersForm: FormGroup;
  categories: string[] = [];
  difficulties: string[] = [];

  sortOptions = [
    { value: 'publishedDate', label: 'Data publikacji' },
    { value: 'rating', label: 'Ocena' },
    { value: 'studentsCount', label: 'Liczba uczniów' },
    { value: 'title', label: 'Tytuł' },
  ];

  constructor(private fb: FormBuilder, private coursesService: CoursesService) {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      difficulty: [''],
      sortBy: ['publishedDate'],
      sortDirection: ['desc'],
    });
  }

  ngOnInit(): void {
    this.categories = this.coursesService.getCategories();
    this.difficulties = this.coursesService.getDifficultyLevels();

    this.filtersForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filters) => {
        this.emitFilters(filters);
      });

    this.emitFilters(this.filtersForm.value);
  }

  private emitFilters(formValue: any): void {
    const filters: CourseFilters = {
      searchTerm: formValue.searchTerm || undefined,
      category: formValue.category || undefined,
      difficulty: formValue.difficulty || undefined,
      sortBy: formValue.sortBy || 'publishedDate',
      sortDirection: formValue.sortDirection || 'desc',
    };

    this.filtersChange.emit(filters);
  }

  clearFilters(): void {
    this.filtersForm.reset({
      searchTerm: '',
      category: '',
      difficulty: '',
      sortBy: 'publishedDate',
      sortDirection: 'desc',
    });
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      frontend: 'Frontend',
      backend: 'Backend',
      fullstack: 'Full Stack',
      mobile: 'Mobile',
      devops: 'DevOps',
      'data-science': 'Data Science',
      'ui-ux': 'UI/UX',
    };
    return labels[category] || category;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      beginner: 'Początkujący',
      intermediate: 'Średnio zaawansowany',
      advanced: 'Zaawansowany',
      expert: 'Ekspert',
    };
    return labels[difficulty] || difficulty;
  }
}
