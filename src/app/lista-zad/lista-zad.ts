import { Component } from '@angular/core';
import { TaskService } from '../services/manager.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormSaveDto } from '../models/form-save-dto';

@Component({
  selector: 'app-lista-zad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-zad.html',
  styleUrl: './lista-zad.scss',
})
export class TaskList {
  public tasks$: Observable<FormSaveDto[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  remove(index: number): void {
    this.taskService.removeTask(index);
  }
}
