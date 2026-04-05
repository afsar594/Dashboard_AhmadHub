import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-card.component.html',
  styleUrl: './widget-card.component.css',
})
export class WidgetCardComponent {
  @Input() title: string = '';
  @Input() value: number | string = '';
  @Input() titleColor: string = '#ffffff';
}
