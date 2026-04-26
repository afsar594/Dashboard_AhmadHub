import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:44379/api/';

  constructor(private http: HttpClient) {}

  // =========================
  // GET APIs
  // =========================

  getItems(id: any) {
    return this.http.get(`${this.baseUrl}Item?id=${id}`);
  }

  getItemss() {
    return this.http.get(`${this.baseUrl}Item`);
  }
   getItemsAll() {
    return this.http.get(`${this.baseUrl}Item/dashboardlist`);
  }

  // =========================
  // CREATE PRODUCT ✅
  // =========================

  // saveItems(product: any) {
  //   const formData = this.buildFormData(product);
  //   return this.http.post(`${this.baseUrl}Item/Create`, formData);
  // }
saveItems(product: any) {
  const formData = this.buildFormData(product);

  // ❌ OLD (wrong)
  // return this.http.post(`${this.baseUrl}Item/Create`, formData);

  // ✅ NEW (correct for your backend)
  return this.http.post(`${this.baseUrl}Item`, formData);
}
  // =========================
  // UPDATE PRODUCT ✅ (WITH FILE SUPPORT)
  // =========================

  UpdateItems(id: any, product: any) {
    const formData = this.buildFormData(product);
    return this.http.put(`${this.baseUrl}Item/${id}`, formData);
  }

  // =========================
  // DELETE
  // =========================

  DeleteItems(id: number) {
    return this.http.delete(`${this.baseUrl}Item/${id}`);
  }

  // =========================
  // COMMON FORM DATA BUILDER 🔥
  // =========================

  private buildFormData(product: any): FormData {
    const formData = new FormData();

    // ✅ SIMPLE FIELDS (MATCH BACKEND EXACTLY)
    formData.append('ItemId', product.ItemId || 0);
    formData.append('ItemName', product.ItemName || '');
    formData.append('Price', product.Price || 0);
    formData.append('OldPrice', product.OldPrice || 0);
    formData.append('Discount', product.Discount || 0);
    formData.append('Qty', product.Qty || 0);
    formData.append('Detail', product.Detail || '');
    formData.append('SaleCode', product.SaleCode || 0);
    formData.append('Category', product.Category || '');
    formData.append('Brand', product.Brand || '');
    formData.append('ClassifiedId', product.ClassifiedId || 0);

    // =========================
    // FILES
    // =========================

    // ✅ SINGLE IMAGE
    if (product.ImageFile) {
      formData.append('ImageFile', product.ImageFile);
    }

    // ✅ MULTIPLE IMAGES
    if (product.ImageFiles && product.ImageFiles.length > 0) {
      product.ImageFiles.forEach((file: File) => {
        formData.append('ImageFiles', file);
      });
    }

    // =========================
    // NESTED ARRAYS
    // =========================

    // ✅ COLORS
    if (product.ItemColors && product.ItemColors.length > 0) {
      product.ItemColors.forEach((c: any, i: number) => {
        formData.append(`ItemColors[${i}].ColorCode`, c.ColorCode);
      });
    }

    // ✅ SIZES
    if (product.ItemSizes && product.ItemSizes.length > 0) {
      product.ItemSizes.forEach((s: any, i: number) => {
        formData.append(`ItemSizes[${i}].SizeName`, s.SizeName);
      });
    }

    return formData;
  }

  // =========================
  // EXTRA APIs
  // =========================

  removeBg(imageBase64: string) {
    return this.http.post(`${this.baseUrl}Item/RemoveBg`, {
      image: imageBase64,
    });
  }

  login(user: any) {
    return this.http.post(`${this.baseUrl}User/login`, user);
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}User/signup`, user);
  }
}