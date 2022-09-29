import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateInputDirective } from '../../directives/validate-input.directive';
import { MessageErrorPipe } from '../../pipes/message-error.pipe';



@NgModule({
  declarations: [
    ValidateInputDirective,
    MessageErrorPipe
  ],
  exports: [
    ValidateInputDirective,
    MessageErrorPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
