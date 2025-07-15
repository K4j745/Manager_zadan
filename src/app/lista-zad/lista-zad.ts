import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../services/manager.service';
import { FormSaveDto } from '../models/form-save-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil, take, map } from 'rxjs';

@Component({
  selector: 'app-lista-zad',
  standalone: true,
  templateUrl: './lista-zad.html',
  styleUrls: ['./lista-zad.scss'],
  imports: [CommonModule, FormsModule],
})
export class ListaZadComponent implements OnInit, OnDestroy {
  tasks$!: Observable<FormSaveDto[]>;
  selectedTasksMap: { [id: string]: boolean } = {};
  allSelected = false;

  // Subject do zarządzania unsubscribe
  private destroy$ = new Subject<void>();

  private currentTasks: FormSaveDto[] = [];

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks();

    // Pojedyncza subskrypcja z wynikami
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.currentTasks = tasks || [];
      this.updateAllSelectedState();
    });
  }

  ngOnDestroy(): void {
    // Czyszczenie subskrypcji
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;

    // Używaj cached tasks zamiast nowej subskrypcji
    this.currentTasks.forEach((task) => {
      this.selectedTasksMap[task.id] = checked;
    });
  }

  markSelectedAsCompleted(): void {
    // Sprawdź czy są zaznaczone elementy
    const selectedTaskIds = Object.keys(this.selectedTasksMap).filter(
      (id) => this.selectedTasksMap[id]
    );

    if (selectedTaskIds.length === 0) {
      return; // Brak zaznaczonych elementów
    }

    // Używaj cached tasks i wykonaj operacje asynchronicznie
    const tasksToUpdate = this.currentTasks.filter(
      (task) => this.selectedTasksMap[task.id]
    );

    tasksToUpdate.forEach((task) => {
      if (task.status !== true) {
        const updatedTask = { ...task, status: true };
        this.taskService.updateTask(updatedTask);
      }
    });

    this.clearSelection();
  }

  removeSelected(): void {
    //Czy zaznaczone?
    const selectedTaskIds = Object.keys(this.selectedTasksMap).filter(
      (id) => this.selectedTasksMap[id]
    );

    if (selectedTaskIds.length === 0) {
      return; // Gdy nic nie zaznaczone
    }

    const tasksToRemove = this.currentTasks.filter(
      (task) => this.selectedTasksMap[task.id]
    );

    // Wykonywanie usunięć
    tasksToRemove.forEach((task) => {
      this.taskService.removeTask(task.id);
      delete this.selectedTasksMap[task.id];
    });

    // Czyszczenie selekcji
    this.clearSelection();
  }

  // Metoda do czyszczenia selekcji
  private clearSelection(): void {
    this.selectedTasksMap = {};
    this.allSelected = false;
  }

  // Metoda do aktualizacji stanu "select all"
  private updateAllSelectedState(): void {
    const totalTasks = this.currentTasks.length;
    const selectedCount = Object.values(this.selectedTasksMap).filter(
      Boolean
    ).length;

    this.allSelected = totalTasks > 0 && selectedCount === totalTasks;
  }

  // Metoda do sprawdzania czy task jest zaznaczony
  isTaskSelected(taskId: string): boolean {
    return !!this.selectedTasksMap[taskId];
  }

  // Metoda do przełączania pojedynczego zadania
  toggleTaskSelection(taskId: string): void {
    this.selectedTasksMap[taskId] = !this.selectedTasksMap[taskId];
    this.updateAllSelectedState();
  }

  // Metoda do sprawdzania czy są jakieś zaznaczone zadania
  hasSelectedTasks(): boolean {
    return Object.values(this.selectedTasksMap).some(Boolean);
  }

  // Metoda do zliczania zaznaczonych zadań
  getSelectedTasksCount(): number {
    return Object.values(this.selectedTasksMap).filter(Boolean).length;
  }
}
