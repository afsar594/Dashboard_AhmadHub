import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.css',
})
export class AdminAddProductComponent {
    baseUrl = 'https://localhost:44379';
  productForm!: FormGroup;
  DataItem: any[] = [];
  filteredData: any[] = [];

  Isbtn: boolean = false;
  SaveData: any;
selectedFile!: File;
selectedFiles: File[] = [];
  searchControl = new FormControl('');

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      oldprice: ['', [Validators.min(0)]],
      discount: [0],
      quantity: ['', [Validators.required, Validators.min(0)]],
      itemCategory: ['', Validators.required],
      productCategory: ['Young Boy', Validators.required],
      description: ['', Validators.required],
      images: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      video: [''],
      sizes: this.fb.array([]),
      currentColor: [''],
      colors: this.fb.array([]),
      status: [true],
    });

    this.getAll();
    this.autoDiscountCalculation();

    // ✅ SEARCH FIX
    this.searchControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();

      this.filteredData = (this.DataItem || []).filter(
        (p: any) =>
          (p.itemName || '').toLowerCase().includes(search) ||
          (p.category || '').toLowerCase().includes(search) ||
          (p.brand || '').toLowerCase().includes(search)
      );
    });
  }

  // ================= GETTERS =================
  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  get colors(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }

  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  // ✅ FIXED (video error solved)
  get video(): string {
    return this.productForm.get('video')?.value;
  }

  // ================= FILE =================
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    this.processFiles(event.dataTransfer.files);
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    this.processFiles(files);
    event.target.value = '';
  }

processFiles(files: FileList) {
  Array.from(files).forEach((file) => {
    if (file.type.startsWith('image/')) {

      // ✅ STORE REAL FILE (for API)
      this.selectedFiles.push(file);

      // ✅ STORE PREVIEW (for UI)
      const reader = new FileReader();
      reader.onload = () => {
        this.images.push(this.fb.control(reader.result));
      };
      reader.readAsDataURL(file);
    }
  });
}

  removeImage(index: number) {
    if (confirm('Remove image?')) {
      this.images.removeAt(index);
    }
  }

  // ✅ FIXED (removeVideo error solved)
  removeVideo() {
    if (confirm('Remove video?')) {
      this.productForm.patchValue({ video: '' });
    }
  }

  // ================= COLORS =================
  presetColors: string[] = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ff9800',
    '#9c27b0',
    '#e91e63',
  ];

  addCustomColor() {
    const color = this.productForm.get('currentColor')?.value;
    if (!color) return;

    if (this.colors.value.some((c: any) => c.value === color)) return;

    this.colors.push(this.fb.group({ value: color }));
    this.productForm.get('currentColor')?.reset();
  }

  selectPresetColor(color: string) {
    if (this.colors.value.some((c: any) => c.value === color)) return;
    this.colors.push(this.fb.group({ value: color }));
  }

  removeColor(index: number) {
    this.colors.removeAt(index);
  }

  // ================= SIZE =================
  toggleSize(size: string, event: any) {
    if (event.target.checked) {
      this.sizes.push(this.fb.control(size));
    } else {
      const index = this.sizes.controls.findIndex((x) => x.value === size);
      if (index !== -1) this.sizes.removeAt(index);
    }
  }

  // ================= DISCOUNT =================
  autoDiscountCalculation() {
    this.productForm.valueChanges.subscribe((val) => {
      const price = Number(val.price);
      const oldprice = Number(val.oldprice);

      if (oldprice > price && oldprice > 0) {
        const discount = Math.round(((oldprice - price) / oldprice) * 100);
        this.productForm.patchValue({ discount }, { emitEvent: false });
      } else {
        this.productForm.patchValue({ discount: 0 }, { emitEvent: false });
      }
    });
  }

  // ================= SAVE =================
 addProduct() {
  const val = this.productForm.value;

  const payload: any = {
    ItemId: this.SaveData ? this.SaveData.itemId : 0,
    ItemName: val.name,
    Price: Number(val.price),
    OldPrice: Number(val.oldprice),
    Discount: Number(val.discount),
    Qty: Number(val.quantity),
    Detail: val.description,
    SaleCode: 1,
    Category: val.itemCategory,
    Brand: val.brand,
    CreatedDate: new Date(),

    ClassifiedId:
      val.productCategory === 'Kids'
        ? 1
        : val.productCategory === 'Young Girl'
        ? 2
        : 3,

    // ✅ FIXED (MATCH BACKEND)
    ItemColors: val.colors?.map((x: any) => ({
      ColorCode: x.value
    })),

    ItemSizes: val.sizes?.map((x: any) => ({
      SizeName: x
    }))
  };

  // ✅ FILES ATTACH
  payload.ImageFiles = this.selectedFiles;

  if (payload.ItemId === 0) this.saveProduct(payload);
  else this.updateProduct(payload);
}

  saveProduct(payload: any) {
    this.api.saveItems(payload).subscribe(() => {
      this.getAll();
      this.ResetForm();
    });
  }

  updateProduct(payload: any) {
    this.api.UpdateItems(payload.itemId, payload).subscribe(() => {
      this.getAll();
      this.ResetForm();
    });
  }

  // ================= EDIT =================
 EditProduct(p: any) {
  this.Isbtn = true;
  this.SaveData = p;

  this.productForm.patchValue({
    name: p.itemName,
    brand: p.brand,
    price: p.price,
    oldprice: p.oldPrice,
    discount: p.discount,
    quantity: p.qty,
    itemCategory: p.category,
    productCategory:
      p.classifiedId === 1
        ? 'Kids'
        : p.classifiedId === 2
        ? 'Young Girl'
        : 'Young Boy',
    description: p.detail,
  });

  // ✅ IMAGES (backend field FIX)
  this.images.clear();
  p.itemImages?.forEach((img: any) =>
    this.images.push(this.fb.control(img.imgPath)) // ✔ FIXED
  );

  // ✅ COLORS FIX
  this.colors.clear();
  p.itemColors?.forEach((c: any) =>
    this.colors.push(this.fb.group({ value: c.colorCode })) // ✔ FIXED
  );

  // ✅ SIZES FIX
  this.sizes.clear();
  p.itemSizes?.forEach((s: any) =>
    this.sizes.push(this.fb.control(s.sizeName)) // ✔ FIXED
  );

  // ⚠️ RESET FILES (important)
  this.selectedFiles = [];
}

  // ================= RESET =================
ResetForm() {
  this.Isbtn = false;
  this.SaveData = null;

  this.productForm.reset({
    productCategory: 'Young Boy',
    status: true,
  });

  this.images.clear();
  this.colors.clear();
  this.sizes.clear();

  // ✅ CLEAR FILES
  this.selectedFiles = [];
}

  // ================= API =================
  getAll() {
    this.api.getItemss().subscribe((res: any) => {
      if (res.isSuccess) {
        this.DataItem = res.data;
        this.filteredData = [...this.DataItem];
      }
    });
  }

  DeleteProduct(p: any) {
    if (confirm('Delete this product?')) {
      this.api.DeleteItems(p.itemId).subscribe(() => this.getAll());
    }
  }

  // ✅ FIXED (product error solved)
  toggleStatus(product: any) {
    product.status = !product.status;

    this.api
      .UpdateItems(product.itemId, { ...product, status: product.status })
      .subscribe(() => {
        console.log(
          `${product.itemName} status updated to ${
            product.status ? 'Active' : 'Inactive'
          }`
        );
      });
  }
}