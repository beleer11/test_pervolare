import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AttributeService } from 'src/app/services/attribute.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-attributes',
  templateUrl: './modal-attributes.component.html',
  styleUrls: ['./modal-attributes.component.scss']
})
export class AttributesModalComponent implements OnInit {

  // Variables
  form: FormGroup;
  loading: boolean = true;
  errors: boolean = false;
  types = [];
  public id?: number;
  public id_type: any;

  constructor(
    private router: Router,
    private attributeService: AttributeService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    public activeModal: NgbActiveModal
  ) {
    this.form = this.createForm();
   }

  ngOnInit(): void {
    this.getType();
  }
    
  createForm() {
    return this.fb.group({
      product: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      selectType: ['', [Validators.required]],
    });
  }

  submit(){
    if (this.form.valid) {
      if(this.id === 0){
        this.storeAttribute();
      }else{
        this.updateAttribute(this.id);
      }
    } else {
      this._sharedService.showAlert('error', 'Hay campos sin diligenciar en el formulario');
    }
  }

  storeAttribute(){
    this.loading = true;
    this.errors = false;

    let data = {
      'name' : this.form.controls['product'].value,
      'type_id' : this.form.controls['selectType'].value,
    };

    this.attributeService.storeAttribute(data)
      .subscribe((res: any) => {
        // Navigate to home page
        this._sharedService.showAlert(res.type_message, res.message);
        if(res.type_message == 'success'){
          this.activeModal.close(true);
        }
        this.loading = false;
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
      });
  }

  getType() {
    this.attributeService.getType()
        .subscribe((res: any) => {
          this.types = res.data;
          if(this.id !== 0){
            this.getInfoProducto(this.id);
          }
          this.loading = false;
        }, (err: any) => {
          // This error can be internal or invalid credentials
          // You need to customize this based on the error.status code
          this._sharedService.showAlert('error', err.message);
          this.errors = true;
        });
  }

  getInfoProducto(id: any) {
    this.attributeService.getInfoProducto(id)
    .subscribe((res: any) => {
      this.form.controls['product'].setValue(res.data.name);
      this.form.controls['selectType'].setValue(res.data.name_type);

      const type : any = this.types.find(({name}) => name == this.form.controls['selectType'].value);
      this.id_type = type.id;
      this.loading = false;
    }, (err: any) => {
      // This error can be internal or invalid credentials
      // You need to customize this based on the error.status code
      this._sharedService.showAlert('error', err.message);
      this.errors = true;
    });
  }

  updateAttribute(id:any){
    this.loading = true;
    this.errors = false;

    let data = {
      'name' : this.form.controls['product'].value,
      'type_id' : this.id_type,
    };

    this.attributeService.updateAttribute(data, id)
      .subscribe((res: any) => {
        // Navigate to home page
        this._sharedService.showAlert(res.type_message, res.message);
        if(res.type_message == 'success'){
          this.activeModal.close(true);
        }
        this.loading = false;
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
        this.loading = false;
      });
  }

  changeSelect($event: any){
    this.id_type = $event;
  }
}

