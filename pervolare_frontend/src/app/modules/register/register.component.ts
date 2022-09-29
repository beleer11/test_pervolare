import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // Variables
  form: FormGroup;
  loading: boolean = false;
  errors: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private _sharedService: SharedService
  ) {
    this.form = this.createForm();
   }

  ngOnInit(): void {
    
  }

  createForm() {
    return this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.minLength(1), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  submit(){
    if (this.form.valid) {
      this.register();
    } else {
      this._sharedService.showAlert('error', 'Hay campos sin diligenciar en el formulario');
    }
  }

  register(){
    this.loading = true;
    this.errors = false;

    let data = {
      'username' : this.form.controls['username'].value,
      'email' : this.form.controls['email'].value,
      'password' : this.form.controls['password'].value
    };

    this.authService.register(data)
      .subscribe((res: any) => {
        // Navigate to home page
        this._sharedService.showAlert(res.type_message, res.message);
        this.router.navigate(['/', 'login']);
      }, (err: any) => {
        // This error can be internal or invalid credentials
        // You need to customize this based on the error.status code
        this._sharedService.showAlert('error', err.message);
        this.errors = true;
      });
  }

  salir(){
    this.router.navigate(['/login']);
  }

}
