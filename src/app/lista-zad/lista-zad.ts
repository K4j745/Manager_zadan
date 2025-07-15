import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/manager.service';
import { FormSaveDto } from '../models/form-save-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-zad',
  standalone: true,
  templateUrl: './lista-zad.html',
  styleUrls: ['./lista-zad.scss'],
  imports: [CommonModule, FormsModule], // naprawa ngModel, ngClass, date
})
export class ListaZadComponent implements OnInit {
  tasks$!: Observable<FormSaveDto[]>;
  selectedTasksMap: { [id: string]: boolean } = {};
  allSelected = false;

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks(); // musi zwracać Observable<FormSaveDto[]>
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;

    this.tasks$.subscribe((tasks) => {
      tasks.forEach((task) => {
        this.selectedTasksMap[task.id] = checked;
      });
    });
  }

  markSelectedAsCompleted(): void {
    this.tasks$.subscribe((tasks) => {
      tasks.forEach((task) => {
        if (this.selectedTasksMap[task.id]) {
          task.status = true;
          this.taskService.updateTask(task); // metoda musi istnieć
        }
      });
    });
  }

  removeSelected(): void {
    this.tasks$.subscribe((tasks) => {
      tasks.forEach((task) => {
        if (this.selectedTasksMap[task.id]) {
          this.taskService.removeTask(task.id); // upewnij się, że `id` to number
          delete this.selectedTasksMap[task.id];
        }
      });
    });
  }
}
