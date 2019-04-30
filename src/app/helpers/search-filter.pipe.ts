import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})

export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (field.includes('.')) {
      const fields: string[] = field.split('.');
      switch (fields.length) {
        case 2: return items.filter(it => ('' + it[fields[0]][fields[1]]).includes(value));
        case 3: return items.filter(it => ('' + it[fields[0]][fields[1]][fields[2]]).includes(value));
        case 4: return items.filter(it => ('' + it[fields[0]][fields[1]][fields[2]][fields[3]]).includes(value));
        case 5: return items.filter(it => ('' + it[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]]).includes(value));
      }
    }
    return items.filter(it => ('' + it[field]).includes(value));
  }
}
