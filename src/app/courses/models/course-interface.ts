// src/app/courses/models/course.interface.ts
export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  duration: string;
  difficulty: DifficultyLevel;
  category: CourseCategory;
  tags: string[];
  publishedDate: Date;
  rating: number;
  studentsCount: number;
  instructor: string;
  sections: CourseSection[];
  videos: Video[];
  pdfs: PdfDocument[];
}

export interface CourseSection {
  id: string;
  title: string;
  anchor: string;
  order: number;
}

export interface Video {
  id: string;
  courseId: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order: number;
  sectionId: string;
}

export interface PdfDocument {
  id: string;
  courseId: string;
  title: string;
  description: string;
  url: string;
  pages: number;
  order: number;
  sectionId: string;
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum CourseCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  DATA_SCIENCE = 'data-science',
  UI_UX = 'ui-ux',
}

export interface CourseFilters {
  category?: CourseCategory;
  difficulty?: DifficultyLevel;
  tags?: string[];
  searchTerm?: string;
  sortBy?: 'publishedDate' | 'rating' | 'studentsCount' | 'title';
  sortDirection?: 'asc' | 'desc';
}
