import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_LENGTH = 50;

@Pipe({ name: 'limitlength' })
export class LimitLengthPipe implements PipeTransform {
  transform(value: string, length: number = DEFAULT_LENGTH): string {
    if (!value) return '';
    if (value.length > (length)) {
      return value.substring(0, (length) - 3) + '...';
    }
    return value;
  }
}
