import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seniorityLevel',
  standalone: true
})
export class SeniorityLevelPipe implements PipeTransform {
  transform(experience: number): string {
    if (experience <= 2) {
      return 'Junior';
    } else if (experience <= 5) {
      return 'Mid';
    } else {
      return 'Senior';
    }
  }
}