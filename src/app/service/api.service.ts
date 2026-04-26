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

  saveItems(product: any) {
  const formData = new FormData();

  // ✅ SIMPLE FIELDS
  Object.keys(product).forEach(key => {
    if (
      key !== 'ItemColors' &&
      key !== 'ItemSizes' &&
      key !== 'ImageFiles' &&
      key !== 'ImageFile'
    ) {
      formData.append(key, product[key]);
    }
  });

  // ✅ SINGLE IMAGE
  if (product.ImageFile) {
    formData.append('ImageFile', product.ImageFile);
  }

  // ✅ MULTIPLE IMAGES
  if (product.ImageFiles) {
    product.ImageFiles.forEach((file: File) => {
      formData.append('ImageFiles', file);
    });
  }

  // ✅ COLORS
  if (product.ItemColors) {
    product.ItemColors.forEach((c: any, i: number) => {
      formData.append(`ItemColors[${i}].ColorCode`, c.ColorCode);
    });
  }

  // ✅ SIZES
  if (product.ItemSizes) {
    product.ItemSizes.forEach((s: any, i: number) => {
      formData.append(`ItemSizes[${i}].SizeName`, s.SizeName);
    });
  }

  return this.http.post(`${this.baseUrl}Item`, formData);
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
