import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phone: string, format: 'national' | 'international' = 'national'): string {
    if (!phone) return '';

    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Handle different phone number lengths
    if (digits.length < 9) return phone; // Return original if too short

    if (format === 'international') {
      // Format: +34 600 123 456
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }

    // National format: 600 123 456
    const nationalDigits = digits.startsWith('34') ? digits.slice(2) : digits;
    if (nationalDigits.length === 9) {
      return `${nationalDigits.slice(0, 3)} ${nationalDigits.slice(3, 6)} ${nationalDigits.slice(6)}`;
    }

    return phone; // Return original if format doesn't match
  }
}