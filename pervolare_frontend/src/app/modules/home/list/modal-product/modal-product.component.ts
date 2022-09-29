import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AttributeService } from 'src/app/services/attribute.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/services/product.service';
import { formatCurrency } from '@angular/common';
import { getCurrencySymbol } from '@angular/common';


@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ProductModalComponent implements OnInit {

  // Variables
  form: FormGroup;
  loading: boolean = true;
  errors: boolean = false;
  cantidad = "";
  colors:any[] = [];
  sizes:any[] = [];
  brands:any[] = [];
  factorys:any[] = [];
  public id?: number;

  constructor(
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private attributeService: AttributeService,
    public activeModal: NgbActiveModal

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
      this.updateProduct();
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

  updateProduct(){
    this.loading = true;
    this.errors = false;

    const data = this.organiceDataSend();

    this.productService.updateProduct(data, this.id)
      .subscribe((res: any) => {
        // Navigate to home page
        this._sharedService.showAlert(res.type_message, res.message);
        if(res.type_message == 'success'){
          this.activeModal.close(true);
        }
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
        this.loading = false;
      });
  }

  public getAttributes(){
    this.attributeService.getAttributes()
      .subscribe((res: any) => {
        this.organiceAttributes(res.data);
        this.getInfoProducto(this.id);
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
        let list = this.form.controls['selectColor'].value[i];
        attributes.push(list);
      }
    }

    //Talla
    if(this.form.controls['selectSize'].value !== ''){
      for (var i = 0; i < this.form.controls['selectSize'].value.length; i++) {
        let list = this.form.controls['selectSize'].value[i];
        attributes.push(list);
      }
    }

    //Marca
    if(this.form.controls['selectBrand'].value !== ''){
      for (var i = 0; i < this.form.controls['selectBrand'].value.length; i++) {
        let list = this.form.controls['selectBrand'].value[i];
        attributes.push(list);
      }
    }

    if(this.form.controls['selectFactory'].value !== ''){
      //Fabrica
      for (var i = 0; i < this.form.controls['selectFactory'].value.length; i++) {
        let list = this.form.controls['selectFactory'].value[i];
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

  getInfoProducto(id: any) {
    this.productService.getInfoProduct(id)
    .subscribe((res: any) => {
      this.dataInput(res.data);
      this.loading = false;

    }, (err: any) => {
      // This error can be internal or invalid credentials
      // You need to customize this based on the error.status code
      this._sharedService.showAlert('error', err.message);
      this.errors = true;
    });
  }

  dataInput(data:any){
    const dataBrand = [];
    const dataColor = [];
    const dataFactory = [];
    const dataSize = [];

    this.form.controls['product'].setValue(data[0].name_product);
    this.form.controls['description'].setValue(data[0].description_product);
    this.form.controls['value'].setValue(data[0].value);

    for (var i = 0; i < data[0].attributes.length; i++) {
      //Marca
      if(data[0].attributes[i]['name_type'].toLowerCase() === "marca"){
        const dataFormat = {'id' : data[0].attributes[i]['id'], 'name' : data[0].attributes[i]['name']};
        dataBrand.push(dataFormat);
      }

      //Color
      if(data[0].attributes[i]['name_type'].toLowerCase() === "color"){
        const dataFormat = {'id' : data[0].attributes[i]['id'], 'name' : data[0].attributes[i]['name']};
        dataColor.push(dataFormat);
      }

      //Talla
      if(data[0].attributes[i]['name_type'].toLowerCase() === "talla"){
        const dataFormat = {'id' : data[0].attributes[i]['id'], 'name' : data[0].attributes[i]['name']};
        dataSize.push(dataFormat);
      }

      //Fabrica
      if(data[0].attributes[i]['name_type'].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "fabrica"){
        const dataFormat = {'id' : data[0].attributes[i]['id'], 'name' : data[0].attributes[i]['name']};
        dataFactory.push(dataFormat);
      }
    }

    this.form.controls['selectBrand'].setValue(dataBrand);
    this.form.controls['selectSize'].setValue(dataSize);
    this.form.controls['selectColor'].setValue(dataColor);
    this.form.controls['selectFactory'].setValue(dataFactory);

  }
}

