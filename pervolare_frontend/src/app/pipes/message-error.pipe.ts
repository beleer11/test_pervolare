import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SharedService } from '../services/shared.service';

@Pipe({
  name: 'messageError',
  pure: true
})
export class MessageErrorPipe implements PipeTransform {

  constructor(private _sharedService: SharedService) { }
  transform(value: any, ...args: any[]) {
    return this._sharedService.getError(value as AbstractControl);

  }

}

