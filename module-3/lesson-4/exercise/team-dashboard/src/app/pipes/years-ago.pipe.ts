import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yearsAgo',
  standalone: true
})
export class YearsAgoPipe implements PipeTransform {
  transform(date: Date, format: 'short' | 'long' = 'short'): string {
    if (!date) return '';

    const now = new Date();
    const joinDate = new Date(date);

    // Calculate the difference in years and months
    let years = now.getFullYear() - joinDate.getFullYear();
    let months = now.getMonth() - joinDate.getMonth();

    // Adjust if we haven't reached the anniversary this year
    if (months < 0 || (months === 0 && now.getDate() < joinDate.getDate())) {
      years--;
      months += 12;
    }

    // Adjust months if we haven't reached the day this month
    if (now.getDate() < joinDate.getDate()) {
      months--;
    }

    if (format === 'long') {
      if (years === 0 && months === 0) {
        return 'Este mes';
      } else if (years === 0) {
        return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
      } else if (months === 0) {
        return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
      } else {
        const yearText = years === 1 ? '1 año' : `${years} años`;
        const monthText = months === 1 ? '1 mes' : `${months} meses`;
        return `Hace ${yearText} y ${monthText}`;
      }
    }

    // Short format
    if (years === 0 && months === 0) {
      return 'Nuevo';
    } else if (years === 0) {
      return `${months}m`;
    } else if (months === 0) {
      return `${years}a`;
    } else {
      return `${years}a ${months}m`;
    }
  }
}