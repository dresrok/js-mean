import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverLift]',
  standalone: true
})
export class AppHoverLiftDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.transform = 'translateY(-5px)';
    this.el.nativeElement.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    this.el.nativeElement.style.transition = 'all 0.2s ease';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.transform = 'translateY(0)';
    this.el.nativeElement.style.boxShadow = 'none';
  }
}
