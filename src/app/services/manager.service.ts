import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormSaveDto } from '../models/form-save-dto';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<FormSaveDto[]>([]);
  public tasks$: Observable<FormSaveDto[]> = this.tasksSubject.asObservable();

  private get currentTasks(): FormSaveDto[] {
    return this.tasksSubject.getValue();
  }

  // Dodaje nowe zadanie
  addTask(dto: FormSaveDto): void {
    // Jeśli nie ma ID, generuj losowe
    if (!dto.id) {
      dto.id = crypto.randomUUID(); // lub jakikolwiek unikalny identyfikator
    }
    this.tasksSubject.next([...this.currentTasks, dto]);
  }

  // Usuwa zadanie po ID
  removeTask(id: string): void {
    const updated = this.currentTasks.filter((task) => task.id !== id);
    this.tasksSubject.next(updated);
  }

  // Aktualizuje istniejące zadanie
  updateTask(updatedTask: FormSaveDto): void {
    const updated = this.currentTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(updated);
  }

  // Zwraca observable listy
  getTasks(): Observable<FormSaveDto[]> {
    return this.tasks$;
  }

  // Zastępuje całą listę
  setTasks(tasks: FormSaveDto[]): void {
    this.tasksSubject.next(tasks);
  }
}
