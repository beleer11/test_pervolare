import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { errorMessages } from '../config/error-messages';
import Swal from 'sweetalert2'

interface IShowConfirmInput {
  title: string;
  text: string;
  type: any;
  confirm: Function
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  constructor() { }

  getError(control: AbstractControl | null) {
    let listMessage: string[] = [];
    if (control?.errors) {
      console.log();
      Object.keys(control.errors).forEach((error: any) => {
        if (control?.errors && control.errors[error]) {
          const message: any = errorMessages[error];
          if (message) listMessage.push(message);
        }
      })
    }
    return listMessage.join('\n');
  }

  showAlert(type: any, title: string) {
    this.toast.fire({
      icon: type,
      title
    })
  }

  showConfirm(args: IShowConfirmInput) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger mx-2'
      },
      buttonsStyling: false
    })
    swal.fire({
      title: args.title,
      text: args.text,
      icon: args.type,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        args.confirm();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }


}
