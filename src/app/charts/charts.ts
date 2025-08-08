import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  registerables,
} from 'chart.js';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  stagger,
  query,
} from '@angular/animations';
import {
  StatisticsService,
  DailyActivity,
  ActivityDistribution,
  LiveData,
} from '../services/statistics.service';
import { Subscription } from 'rxjs';

// Rejestracja wszystkich komponentów Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
  animations: [
    // trigger('slideInUp', [
    //   state('in', style({ transform: 'translateY(0)', opacity: 1 })),
    //   transition('void => *', [
    //     style({ transform: 'translateY(50px)', opacity: 0 }),
    //     animate('0.6s ease-out'),
    //   ]),
    // ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(50px)' }),
            stagger(200, [
              animate(
                '0.6s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class Charts implements OnInit, OnDestroy {
  // Dane dla wykresów
  dailyActivities: DailyActivity[] = [];
  activityDistribution: ActivityDistribution[] = [];
  liveData: LiveData[] = [];

  // Konfiguracje wykresów
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: { y: { beginAtZero: true } },
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Wykonane zadania', backgroundColor: '#FF6384' },
      { data: [], label: 'Przetworzone fiszki', backgroundColor: '#36A2EB' },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: { y: { beginAtZero: true } },
  };
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Minuty nauki dziennie',
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
    },
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  public liveChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };
  public liveChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Aktywność na żywo',
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  private liveDataSubscription?: Subscription;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.subscribeLiveData();
  }

  ngOnDestroy(): void {
    this.liveDataSubscription?.unsubscribe();
  }

  private loadStatistics(): void {
    this.dailyActivities = this.statisticsService.generateDailyActivities();
    this.activityDistribution =
      this.statisticsService.generateActivityDistribution();

    // Aktualizacja danych wykresu słupkowego
    this.barChartData = {
      ...this.barChartData,
      labels: this.dailyActivities.map((a) => a.date),
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: this.dailyActivities.map((a) => a.tasks),
        },
        {
          ...this.barChartData.datasets[1],
          data: this.dailyActivities.map((a) => a.flashcards),
        },
      ],
    };

    // Aktualizacja danych wykresu liniowego
    this.lineChartData = {
      ...this.lineChartData,
      labels: this.dailyActivities.map((a) => a.date),
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: this.dailyActivities.map((a) => a.studyMinutes),
        },
      ],
    };

    // Aktualizacja danych wykresu kołowego
    this.pieChartData = {
      ...this.pieChartData,
      labels: this.activityDistribution.map((a) => a.label),
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: this.activityDistribution.map((a) => a.value),
          backgroundColor: this.activityDistribution.map((a) => a.color),
        },
      ],
    };
  }

  private subscribeLiveData(): void {
    this.liveDataSubscription = this.statisticsService.liveData$.subscribe(
      (data) => {
        this.liveData = data;
        this.liveChartData = {
          ...this.liveChartData,
          labels: data.map((d) => d.timestamp.toLocaleTimeString('pl-PL')),
          datasets: [
            {
              ...this.liveChartData.datasets[0],
              data: data.map((d) => d.value),
            },
          ],
        };
      }
    );
  }

  refreshData(): void {
    this.loadStatistics();
  }

  getDailyAverage(): number {
    return this.statisticsService.calculateDailyAverage(this.dailyActivities);
  }

  getTotalTasks(): number {
    return this.dailyActivities.reduce((sum, a) => sum + a.tasks, 0);
  }

  getTotalFlashcards(): number {
    return this.dailyActivities.reduce((sum, a) => sum + a.flashcards, 0);
  }

  getTotalStudyTime(): number {
    return this.dailyActivities.reduce((sum, a) => sum + a.studyMinutes, 0);
  }
}
