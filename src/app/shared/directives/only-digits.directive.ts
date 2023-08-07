import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyDigits]'
})
export class OnlyDigitsDirective {

  private regex: RegExp = new RegExp(/^[0-9]*$/);

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.key;
    if (!this.regex.test(input) && !this.isSpecialKeyInput(event)) {
      event.preventDefault();
    }
  }

  private isSpecialKeyInput(event: KeyboardEvent): boolean {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Tab' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === 'Control' ||
      event.key === 'Alt' ||
      event.key === 'Shift'
    );
  }
}
