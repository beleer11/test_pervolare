import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './modal-product/modal-product.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  loading: boolean = true;
  public displayedColumns: any;
  public products: any;
  public dataSource: any;
  
  constructor(
    private router: Router,
    private productService: ProductService,
    private _sharedService: SharedService,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.loading = true;
    this.productService.list()
      .subscribe((res: any) => {
        this.products = res.data;
      }, (err: any) => {
        this._sharedService.showAlert('error', err.message);
      });

      this.loading = false;
  }

  editProduct(id:any){
    const modalRef = this._modalService.open(ProductModalComponent, {
      keyboard: false,
      beforeDismiss: () => false
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((res) => {
      if (res) this.list();
    });
  }

  openProductModal(id?: number) {
    const modalRef = this._modalService.open(ProductModalComponent, {
      keyboard: false,
      beforeDismiss: () => false
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((res) => {
      if (res) this.list();
    });
  }

  delete(id?: number) {
    if (id) {
      this.productService.delete(id)
      .subscribe((res: any) => {
          this.list();
          this._sharedService.showAlert(res.type_message, res.message);
        }, (err: any) => {
          this._sharedService.showAlert('error', err.message);
        });
    }

  }   
}
