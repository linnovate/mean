import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filterDragulaList', pure: false})
export class FilterDragulaListPipe implements PipeTransform {

  transform(items : Array < any >, args : string) : any {
    if(!items) 
      return [];
    items.map(item => {
      item.hide = false;
      return item;
    });
    if (!args) 
      return items;
    return items.map(item => {
      if (item.name.toLowerCase().indexOf(args.toLowerCase()) == -1) 
        item.hide = true;
      return item;
    });
  }

}
