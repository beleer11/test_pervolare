import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AttributeService } from 'src/app/services/attribute.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributesModalComponent } from './modal-attribute/modal-attributes.component';


@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit { 

  constructor(
    private router: Router,
    private attributeService: AttributeService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private _modalService: NgbModal
  ) {}

  public attributes:any;
  loading: boolean = true;

  ngOnInit(): void {
    this.getData();
    this.loading = false;
  }

  openAttributeModal(id?: number) {
    const modalRef = this._modalService.open(AttributesModalComponent, {
      keyboard: false,
      beforeDismiss: () => false
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((res) => {
      if (res) this.refreshData();
    });
  }

  refreshData() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.attributeService.list()
    .subscribe((res: any) => {
      this.attributes = res.data;
      this.loading = false;
    }, (err: any) => {
      this._sharedService.showAlert('error', err.message);
    });
  }

  delete(id?: number) {
    if (id) {
      this.attributeService.delete(id)
      .subscribe((res: any) => {
          this.refreshData();
          this._sharedService.showAlert(res.type_message, res.message);
        }, (err: any) => {
          this._sharedService.showAlert('error', err.message);
        });
    }

  }    
  
}

