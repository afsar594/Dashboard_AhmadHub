import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-widget-chart',
  imports: [],
  templateUrl: './widget-chart.component.html',
  styleUrl: './widget-chart.component.css',
})
export class WidgetChartComponent {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() chartType: string = 'bar';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  ngAfterViewInit(): void {
    new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType as any,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Sales',
            data: this.data,
            // borderColor: '#00F5D4',
            // backgroundColor: '#FF4D6D',
            backgroundColor: [
  '#FF4D6D',
  '#4CC9F0',
  '#F72585',
  '#B5179E',
  '#7209B7',
],
borderColor: [
  '#FF4D6D',
  '#4CC9F0',
  '#F72585',
  '#B5179E',
  '#7209B7',
],
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
  responsive: true,
  plugins: { 
    legend: { display: false } 
  },
  scales: {
    x: {
      ticks: {
        color: '#00F5D4', // 
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    y: {
      ticks: {
        color: '#ffffff' // 
      }
    }
  }
}
    });
  }
}
