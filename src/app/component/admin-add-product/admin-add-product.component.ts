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
  productForm!: FormGroup;
  DataItem: any;
  Isbtn: boolean = false;
  SaveData: any;
  itemColor: any;

  searchControl = new FormControl('');
  filteredData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      oldprice: ['', [Validators.min(0)]],
      discount: [0, Validators.min(0)],
      quantity: ['', [Validators.required, Validators.min(0)]],
      itemCategory: ['', Validators.required],
      productCategory: ['Young Boy', Validators.required],
      description: ['', Validators.required],
      images: this.fb.array([], Validators.required),
      video: [''],
      sizes: this.fb.array([]),
      currentColor: [''],
      colors: this.fb.array([]),
      status: [true],
    });
    this.getAll();

    this.filteredData = this.DataItem;

    // this.DataItem = [
    //   {
    //     itemId: 1,
    //     itemName: 'Cool T-Shirt',
    //     brand: 'BrandX',
    //     price: 500,
    //     oldprice: 700,
    //     discount: 29,
    //     qty: 20,
    //     category: 'Clothing',
    //     classifiedId: 3,
    //     detail:
    //       'High quality cotton t-shirt for young boys. Comfortable and trendy design.',
    //     // sizes: ['S', 'M', 'L'],
    //     // color: [{ value: '#ff0000' }, { value: '#0000ff' }],
    //     itemSizes: [{ sizeNames: 'S' }, { sizeNames: 'M' }, { sizeNames: 'L' }],

    //     itemColors: [
    //       { colorCodes: '#ff0000' },
    //       { colorCodes: '#0000ff' },
    //       { colorCodes: '#26acce' },
    //     ],

    //     itemImages: [
    //       {imgPaths:'https://i.pinimg.com/1200x/46/72/0d/46720dacf89fe86096d7157cddbf7ff8.jpg'},
    //       {imgPaths:'https://i.pinimg.com/736x/b9/98/8a/b9988a39dab7e7fb741b6e8febfb57f1.jpg'},
    //     ],
    //     createdDate: new Date(),
    //   },
    //   {
    //     itemId: 2,
    //     itemName: 'Stylish Jacket',
    //     brand: 'BrandY',
    //     price: 1200,
    //     oldprice: 1500,
    //     discount: 20,
    //     qty: 10,
    //     category: 'Winter Wear',
    //     classifiedId: 2,
    //     detail:
    //       'Warm and stylish jacket suitable for young girls. Perfect for winter season.',
    //     itemSizes: [
    //       { sizeNames: 'S' },
    //       { sizeNames: 'L' },
    //       { sizeNames: 'XL' },
    //     ],

    //     itemColors: [
    //       { colorCodes: '#ff0000' },
    //       { colorCodes: '#0000ff' },
    //       { colorCodes: '#e41665' },
    //       { colorCodes: '#d426e4' },
    //     ],
    //     itemImages: [
    //       {imgPaths:'https://i.pinimg.com/1200x/09/1f/f3/091ff3982274db868af8175bcb12fd6a.jpg'},
    //       {imgPaths:'https://i.pinimg.com/736x/92/bb/a3/92bba38a680b10ef7110e94841c85208.jpg'},
    //       {imgPaths:'https://i.pinimg.com/1200x/4c/08/b6/4c08b6bb54e1bf7b7ce431ec82835e22.jpg'},
    //     ],
    //     createdDate: new Date(),
    //   },
    //   {
    //     itemId: 3,
    //     itemName: 'Kids Sneakers',
    //     brand: 'BrandZ',
    //     price: 800,
    //     oldprice: 1000,
    //     discount: 20,
    //     qty: 15,
    //     category: 'Footwear',
    //     classifiedId: 1,
    //     detail:
    //       'Comfortable sneakers for kids. Colorful design and durable material.',
    //     itemSizes: [
    //       { sizeNames: 'S' },
    //       { sizeNames: 'M' },
    //       { sizeNames: 'XL' },
    //     ],

    //     itemColors: [
    //       { colorCodes: '#ff0000' },
    //       { colorCodes: '#0000ff' },
    //       { colorCodes: '#2b1a1a' },
    //       { colorCodes: '#1be436' },
    //       { colorCodes: '#865467' },
    //     ],
    //     itemImages: [
    //     {imgPaths:'https://i.pinimg.com/1200x/c4/13/55/c4135537d9c8125ffcaa728d01951da2.jpg'},
    //     ],
    //     createdDate: new Date(),
    //   },
    // ];

    this.filteredData = [...this.DataItem];

    this.searchControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();

      this.filteredData = this.DataItem.filter(
        (p: any) =>
          (p.itemName || '').toLowerCase().includes(search) ||
          (p.category || '').toLowerCase().includes(search) ||
          (p.brand || '').toLowerCase().includes(search),
      );
    });

    // 🔹 Dummy ke liye backend ko temporarily comment karo

    this.autoDiscountCalculation();
  }

  //   this.getAll();
  //   this.autoDiscountCalculation();
  // }

  // FormArray getters
  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }
  get video(): string {
    return this.productForm.get('video')?.value;
  }

  get colors(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }

  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  // Drag & drop images
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    this.processFiles(event.dataTransfer.files);
  }

  maxVideoSize = 5 * 1024 * 1024;
  maxVideoDuration = 30;
  videos: string[] = [];
colorsList: string[] = [];

  processFiles(files: FileList) {

  Array.from(files).forEach((file) => {

    // ================= IMAGE =================
    if (file.type.startsWith('image/')) {

      // 🚫 extra safety (even drag-drop bypass)
      if (!this.checkImageLimit(1)) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.images.push(this.fb.control(reader.result));
      };
      reader.readAsDataURL(file);
    }

      // ================= VIDEO =================
      if (file.type.startsWith('video/')) {
        // ❌ size check
        if (file.size > this.maxVideoSize) {
          alert('Video must be 5 MB or less');
          return;
        }

        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);

          // ❌ duration check
          if (videoElement.duration > this.maxVideoDuration) {
            alert('Video duration must be 30 seconds or less');
            return;
          }

          // ✅ valid video
          const reader = new FileReader();
          reader.onload = () => {
            this.productForm.patchValue({
              video: reader.result,
            });
          };
          reader.readAsDataURL(file);
        };

        videoElement.src = URL.createObjectURL(file);
      }
    });
  }

  // onFileSelect(event: any) {
  //   const files: FileList = event.target.files;
  //   this.processFiles(files);
  //   event.target.value = '';
  // }

  onFileSelect(event: any) {
  const files: FileList = event.target.files;

  // 🚫 block if total exceeds 5
  if (!this.checkImageLimit(files.length)) {
    event.target.value = '';
    return;
  }

  this.processFiles(files);
  event.target.value = '';
}

  removeImage(index: number) {
    const ok = window.confirm('Are you sure you want to remove this image?');
    if (!ok) return;
    this.images.removeAt(index);
  }
  removeVideo() {
    const ok = window.confirm('Are you sure you want to remove this video?');
    if (!ok) return;
    this.productForm.patchValue({ video: '' });
  }

  // Sizes toggle
  toggleSize(size: string, event: any) {
    if (event.target.checked) {
      this.sizes.push(this.fb.control(size));
    } else {
      const index = this.sizes.controls.findIndex((x) => x.value === size);
      if (index !== -1) this.sizes.removeAt(index);
    }
  }

  // Colors
  presetColors: string[] = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ff9800', '#9c27b0', '#e91e63',
  '#795548', '#607d8b'
];

// 🎯 Custom color add (input se)
addCustomColor() {
  const color = this.productForm.get('currentColor')?.value;

  if (!color) return;

  if (this.colors.value.some((c: any) => c.value === color)) return;

  this.colors.push(this.fb.group({ value: color }));
  console.log('Selected Colors:', this.colorsList);

  this.productForm.get('currentColor')?.reset();
}

// 🎨 Preset color click
selectPresetColor(color: string) {
  if (this.colors.value.some((c: any) => c.value === color)) return;

  this.colors.push(this.fb.group({ value: color }));
  console.log('Colors List:', this.colorsList);
}

  removeColor(index: number) {
    this.colors.removeAt(index);
    console.log('After Remove:', this.colorsList);
  }

  // Auto Discount Calculation
  autoDiscountCalculation() {
    this.productForm.valueChanges.subscribe((val) => {
      const price = Number(val.price);
      const oldprice = Number(val.oldprice);

      if (isNaN(price) || isNaN(oldprice)) {
        this.productForm.patchValue({ discount: 0 }, { emitEvent: false });
        return;
      }

      if (oldprice > 0 && price > 0 && oldprice > price) {
        const discount = Math.round(((oldprice - price) / oldprice) * 100);
        this.productForm.patchValue({ discount }, { emitEvent: false });
      } else {
        this.productForm.patchValue({ discount: 0 }, { emitEvent: false });
      }
    });
  }

  // addProduct() {
  //   const val = this.productForm.value;

  //   const payload = {
  //     itemId: this.SaveData ? this.SaveData.itemId : 0,
  //     itemName: val.name,
  //     price: Number(val.price),
  //     oldPrice: Number(val.oldprice),
  //     discount: Number(val.discount),
  //     qty: Number(val.quantity),
  //     img: '',
  //     detail: val.description,
  //     saleCode:1,
  //     color: val.colors?.map((c: any) => c.value).join(','),

  //     classifiedId:
  //       val.productCategory === 'Kids'
  //         ? 1
  //         : val.productCategory === 'Young Girl'
  //           ? 2
  //           : 3,

  //     category: val.itemCategory,
  //     brand: val.brand,
  //     createdDate: new Date(),

  //     itemColors: val.colors?.map((x: any) => ({
  //       id: x.id ?? 0,
  //       itemId: 0,
  //       colorCodes: x.value,
  //     })),

  //     itemSizes: val.sizes?.map((x: any) => ({
  //       id: x.id ?? 0,
  //       itemId: 0,
  //       sizeNames: x,
  //     })),

  //     itemImages: val.images?.map((x: any) => ({
  //       id: x.id ?? 0,
  //       itemId: 0,
  //       imgPaths: x,
  //     })),
  //   };

  //   if (payload.itemId === 0) this.saveProduct(payload);
  //   else this.updateProduct(payload);
  // }

  addProduct() {
     console.log('FINAL COLORS:', this.colorsList); 
  const val = this.productForm.value;

  const formData = new FormData();

  // ================= TEXT DATA =================
  formData.append('itemId', this.SaveData ? this.SaveData.itemId : '0');
  formData.append('itemName', val.name);
  formData.append('price', val.price);
  formData.append('oldPrice', val.oldprice);
  formData.append('discount', val.discount);
  formData.append('qty', val.quantity);
  formData.append('detail', val.description);
  formData.append('category', val.itemCategory);
  formData.append('brand', val.brand);
  formData.append('classifiedId',
    val.productCategory === 'Kids'
      ? '1'
      : val.productCategory === 'Young Girl'
        ? '2'
        : '3'
  );

  // ================= COLORS =================
  formData.append(
    'colors',
    JSON.stringify(val.colors?.map((c: any) => c.value))
  );

  // ================= SIZES =================
  formData.append(
    'sizes',
    JSON.stringify(val.sizes)
  );

  // ================= IMAGES (FILES) =================
  this.images.controls.forEach((img: any, index: number) => {
    formData.append('images', img.value);
  });

  // ================= VIDEO =================
  if (val.video) {
    formData.append('video', val.video);
  }

  // ================= API CALL =================
  if (!this.SaveData) {
    this.api.saveItems(formData).subscribe(() => this.getAll());
  } else {
    this.api.UpdateItems(this.SaveData.itemId, formData).subscribe(() => this.getAll());
  }
}

private checkImageLimit(count: number = 1): boolean {
  if (this.images.length + count > 5) {
    alert('You can upload maximum 5 images only');
    return false;
  }
  return true;
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

  // Edit Product
  EditProduct(p: any) {
    this.Isbtn = true;
    this.SaveData = p;
    this.productForm.patchValue({
      name: p.itemName,
      brand: p.brand,
      price: p.price,
      oldprice: p.oldprice,
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
      video: p.video || '',
    });

    // Clear & set images
    this.images.clear();
    if (p.itemImages?.length > 0)
      p.itemImages.forEach((img: any) =>
        this.images.push(this.fb.control(img.imgPaths)),
      );

    // Clear & set colors
    this.colors.clear();
    if (p.itemColors?.length > 0)
      p.itemColors.forEach((c: any) =>
        this.colors.push(this.fb.group({ value: c.colorCodes })),
      );

    // Clear & set sizes
    this.sizes.clear();
    if (p.itemSizes?.length > 0)
      p.itemSizes.forEach((s: any) =>
        this.sizes.push(this.fb.control(s.sizeNames)),
      );
  }

  ResetForm() {
    this.Isbtn = false;
    this.SaveData = null;

    this.sizes.clear();
    this.colors.clear();
    this.images.clear();

    this.productForm.reset({
      name: '',
      brand: '',
      productCategory: 'Young Boy',
      price: '',
      oldprice: '',
      discount: '',
      quantity: '',
      itemCategory: '',
      description: '',
      video: '',
      currentColor: '',
      status: true,
    });
    this.filteredData = [...this.DataItem];
  }

  getAll() {
    this.api.getItemsAll().subscribe((res: any) => {
      if (res.isSuccess) {
        this.DataItem = res?.data;
            this.filteredData = [...this.DataItem];

        console.log('dataTime', this.DataItem);
                console.log(' this.filteredData', this.filteredData);

      }
    });
  }
  DeleteProduct(p: any) {
    const ok = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.',
    );
    if (!ok) return;
    this.api.DeleteItems(p.itemId).subscribe(() => this.getAll());
  }
  toggleStatus(product: any) {
    product.status = !product.status; // Toggle value

    // Update backend
    this.api
      .UpdateItems(product.itemId, { ...product, status: product.status })
      .subscribe(() => {
        // Optional: toast / alert
        console.log(
          `${product.itemName} status updated to ${
            product.status ? 'Active' : 'Inactive'
          }`,
        );
      });
  }
}
