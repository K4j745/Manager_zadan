import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DailyActivity {
  date: string;
  tasks: number;
  flashcards: number;
  studyMinutes: number;
}

export interface ActivityDistribution {
  label: string;
  value: number;
  color: string;
}

export interface LiveData {
  timestamp: Date;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private liveDataSubject = new BehaviorSubject<LiveData[]>([]);
  public liveData$ = this.liveDataSubject.asObservable();

  constructor() {
    this.initializeLiveData();
  }

  // Generowanie danych aktywności dla ostatnich 15 dni
  generateDailyActivities(): DailyActivity[] {
    const activities: DailyActivity[] = [];
    const today = new Date();

    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      activities.push({
        date: date.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
        }),
        tasks: Math.floor(Math.random() * 15) + 1,
        flashcards: Math.floor(Math.random() * 30) + 5,
        studyMinutes: Math.floor(Math.random() * 120) + 30,
      });
    }

    return activities;
  }

  // Generowanie danych dla wykresu kołowego - rozkład aktywności
  generateActivityDistribution(): ActivityDistribution[] {
    const total = 480; // 8 godzin w minutach
    const managerTime = Math.floor(Math.random() * 120) + 60;
    const flashcardsTime = Math.floor(Math.random() * 100) + 40;
    const hangmanTime = Math.floor(Math.random() * 80) + 20;
    const otherTime = total - managerTime - flashcardsTime - hangmanTime;

    return [
      {
        label: 'Manager zadań',
        value: managerTime,
        color: '#FF6384',
      },
      {
        label: 'Fiszki',
        value: flashcardsTime,
        color: '#36A2EB',
      },
      {
        label: 'Hangman',
        value: hangmanTime,
        color: '#FFCE56',
      },
      {
        label: 'Inne',
        value: otherTime,
        color: '#4BC0C0',
      },
    ];
  }

  // Inicjalizacja i aktualizacja danych live
  private initializeLiveData(): void {
    // Generowanie początkowych danych
    const initialData: LiveData[] = [];
    const now = new Date();

    for (let i = 9; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5000);
      initialData.push({
        timestamp,
        value: Math.floor(Math.random() * 100) + 20,
      });
    }

    this.liveDataSubject.next(initialData);

    // Aktualizacja co 5 sekund
    interval(5000).subscribe(() => {
      const currentData = this.liveDataSubject.value;
      const newData = [...currentData];

      // Usuwanie najstarszego punktu
      newData.shift();

      // Dodaj nowy punkt
      newData.push({
        timestamp: new Date(),
        value: Math.floor(Math.random() * 100) + 20,
      });

      this.liveDataSubject.next(newData);
    });
  }

  // Obliczanie średniej dziennej aktywności
  calculateDailyAverage(activities: DailyActivity[]): number {
    const total = activities.reduce(
      (sum, activity) => sum + activity.studyMinutes,
      0
    );
    return Math.round(total / activities.length);
  }

  // Generowanie danych trendowych
  generateTrendData(): number[] {
    const data: number[] = [];
    let baseValue = Math.floor(Math.random() * 50) + 50;

    for (let i = 0; i < 15; i++) {
      const variation = (Math.random() - 0.5) * 20;
      baseValue += variation;
      baseValue = Math.max(10, Math.min(150, baseValue)); // Ograniczenie wartości
      data.push(Math.round(baseValue));
    }

    return data;
  }
}
