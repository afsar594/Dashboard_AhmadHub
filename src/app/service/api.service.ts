import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  removeBg(imageBase64: string) {
    return this.http.post(`${this.baseUrl}Item/RemoveBg`, {
      image: imageBase64,
    });
  }

  private baseUrl = 'https://localhost:44379/api/';
  constructor(private http: HttpClient) {}

  getItems(id: any) {
    return this.http.get(`${this.baseUrl}Item?id=${id}`);
  }
  getItemsAll() {
    return this.http.get(`${this.baseUrl}Item/dashboardlist`);
  }

  saveItems(data: any) {
    return this.http.post(`${this.baseUrl}Item`, data);
  }
  UpdateItems(id: any, data: any) {
    return this.http.put(`${this.baseUrl}Item/${id}`, data);
  }
  DeleteItems(id: number) {
    return this.http.delete(`${this.baseUrl}Item/${id}`);
  }
  // for user creadential

  login(user: any) {
    return this.http.post(`${this.baseUrl}User/login`, user);
  }
  register(user: any) {
    return this.http.post(`${this.baseUrl}User/signup`, user);
  }
}
