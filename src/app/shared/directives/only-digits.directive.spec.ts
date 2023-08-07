import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OnlyDigitsDirective } from './only-digits.directive';

@Component({
  template: `<input appOnlyDigits type="text">`,
})
class TestComponent {}

describe('OnlyDigitsDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;
  let directiveElm: DebugElement;
  let directive: OnlyDigitsDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, OnlyDigitsDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.css('input'));
    directiveElm = fixture.debugElement.query(By.directive(OnlyDigitsDirective));
    directive = directiveElm.injector.get(OnlyDigitsDirective);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(inputElement).toBeTruthy();
  });

  it('onKeyDown call with keyCode = 1', () => {
    const eventInit: KeyboardEventInit = {
      keyCode: 1,
      ctrlKey: false
    };
    const event = new KeyboardEvent('keydown', eventInit);
    spyOn(directive, 'onKeyDown').and.callThrough();
    directiveElm.triggerEventHandler('keydown', event);
    expect(directive.onKeyDown).toHaveBeenCalled();
  });

});
