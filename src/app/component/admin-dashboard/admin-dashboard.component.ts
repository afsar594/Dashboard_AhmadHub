import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetCardComponent } from '../widget-card/widget-card.component';
import { WidgetChartComponent } from '../widget-chart/widget-chart.component';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, WidgetCardComponent, WidgetChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  lowStockProducts: Product[] = [];
  outOfStockProducts: Product[] = [];

  stats = {
    totalProducts: 150,
    totalSales: 4500,
    dailySales: 120,
    weeklySales: 700,
    monthlySales: 2600,
  };

  productSalesLabels = [
    'Men’s Classic Warm Hoodie',
    'Graphic Typography T-shirt',
    'Denim Jacket',
    'Bomber Jacket',
    'Oversized T-shirt',
  ];
  productSalesData = [15.99, 19.5, 15.49, 10.99, 15.49];

  weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeklySales = [50, 70, 95, 120, 15.49, 180, 110];

  products: Product[] = [
    {
      id: 1,
      name: 'Men’s Classic Warm Hoodie',
      price: 15.99,
      totalQuantity: 130,
      sold: 120,
    },
    {
      id: 2,
      name: 'Graphic Typography T-shirt',
      price: 19.5,
      totalQuantity: 95,
      sold: 90,
    },
    {
      id: 3,
      name: 'Denim Jacket',
      price: 15.49,
      totalQuantity: 150,
      sold: 150,
    },
    { id: 4, name: 'Bomber Jacket', price: 10.99, totalQuantity: 80, sold: 60 },
    {
      id: 5,
      name: 'Oversized T-shirt',
      price: 15.49,
      totalQuantity: 112,
      sold: 110,
    },
  ];
  allProduct: any;

  constructor(
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.getAllProduch();
    this.lowStockProducts = this.products.filter((p) => {
      const remaining = p.totalQuantity - p.sold;
      return remaining > 0 && remaining <= 5;
    });
    this.outOfStockProducts = this.products.filter((p) => {
      const remaining = p.totalQuantity - p.sold;
      return remaining === 0;
    });
  }
  navigatetoadminproduct() {
    this.router.navigate(['adminproductmanagement']);
  }
  getAllProduch() {
    this.api.getItemsAll().subscribe((res: any) => {
      this.allProduct = res.data;

    });
  }
}
interface Product {
  id: number;
  name: string;
  price: number;
  totalQuantity: number;
  sold: number;
}
