import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormSaveDto } from '../models/form-save-dto';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<FormSaveDto[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private get currentTasks(): FormSaveDto[] {
    return this.tasksSubject.getValue();
  }

  addTask(dto: FormSaveDto): void {
    this.tasksSubject.next([...this.currentTasks, dto]);
  }

  removeTask(index: number): void {
    const tasks = [...this.currentTasks];
    tasks.splice(index, 1);
    this.tasksSubject.next(tasks);
  }
}
