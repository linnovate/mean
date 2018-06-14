import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecase'
})
export class TitlecasePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      return value
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    } else {
      return value;
    }
  }

}
