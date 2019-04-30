import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fundsFilter',
  pure: false
})

export class FundsFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any[]): any[] {
    if (!items) {
      return [];
    }
    return items.filter(it => ('' + it[field]).includes(value[0]) || value[1]);
  }
}
