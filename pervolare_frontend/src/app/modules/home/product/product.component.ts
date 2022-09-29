import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { AttributeService } from 'src/app/services/attribute.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  // Variables
  form: FormGroup;
  loading: boolean = false;
  errors: boolean = false;
  cantidad = "";
  colors:any[] = [];
  sizes:any[] = [];
  brands:any[] = [];
  factorys:any[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private attributeService: AttributeService
  ) {
    this.form = this.createForm();
   }

  ngOnInit(): void {
    this.getAttributes();
  }
    
  createForm() {
    return this.fb.group({
      product: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      value: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      selectColor: [''],
      selectSize: [''],
      selectBrand: [''],
      selectFactory: [''],
    });
  }

  submit(){
    if (this.form.valid) {
      this.storeProduct();
    } else {
      this._sharedService.showAlert('error', 'Hay campos sin diligenciar en el formulario');
    }
  }

  updateValue(value: any) {
    let val = parseInt(value.value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }

  storeProduct(){
    this.loading = true;
    this.errors = false;

    const data = this.organiceDataSend();

    this.productService.storeProduct(data)
      .subscribe((res: any) => {
        // Navigate to home page
        this._sharedService.showAlert(res.type_message, res.message);
        window.location.reload();
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
      });
  }

  public getAttributes(){
    this.attributeService.getAttributes()
      .subscribe((res: any) => {
        this.organiceAttributes(res.data);
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
      });
  }

  organiceAttributes(data: any) {
    for (var i = 0; i < data.length; i++) {
      //Color
      if(data[i]['name_type'].toLowerCase() === "color"){
        const dataFormat = {'id' : data[i]['id'], 'name' : data[i]['name']};
        this.colors.push(dataFormat);
      }
      //Talla
      if(data[i]['name_type'].toLowerCase() === "talla"){
        const dataFormat = {'id' : data[i]['id'], 'name' : data[i]['name']};
        this.sizes.push(dataFormat);
      }
      //Marca
      if(data[i]['name_type'].toLowerCase() === "marca"){
        const dataFormat = {'id' : data[i]['id'], 'name' : data[i]['name']};
        this.brands.push(dataFormat);
      }
      //Fabrica
      if(data[i]['name_type'].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "fabrica"){
        const dataFormat = {'id' : data[i]['id'], 'name' : data[i]['name']};
        this.factorys.push(dataFormat);
      }
    }
  }

  organiceDataSend() {
    const attributes = [];
    //Color
    if(this.form.controls['selectColor'].value !== ''){
      for (var i = 0; i < this.form.controls['selectColor'].value.length; i++) {
        let list = {'id' : this.form.controls['selectColor'].value[i]};
        attributes.push(list);
      }
    }

    //Talla
    if(this.form.controls['selectSize'].value !== ''){
      for (var i = 0; i < this.form.controls['selectSize'].value.length; i++) {
        let list = {'id' : this.form.controls['selectSize'].value[i]};
        attributes.push(list);
      }
    }

    //Marca
    if(this.form.controls['selectBrand'].value !== ''){
      for (var i = 0; i < this.form.controls['selectBrand'].value.length; i++) {
        let list = {'id' : this.form.controls['selectBrand'].value[i]};
        attributes.push(list);
      }
    }

    if(this.form.controls['selectFactory'].value !== ''){
      //Fabrica
      for (var i = 0; i < this.form.controls['selectFactory'].value.length; i++) {
        let list = {'id' : this.form.controls['selectFactory'].value[i]};
        attributes.push(list);
      }
    }

    let data = {
      'name' : this.form.controls['product'].value,
      'value' : this.form.controls['value'].value,
      'description' : this.form.controls['description'].value,
      'attributes' : attributes
    };

    return data;
  }
}


