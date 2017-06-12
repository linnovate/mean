import {
  fakeAsync,
  inject,
  tick,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { By } from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';

/**
 * Load the implementations that should be tested.
 */
import { XLargeDirective } from './x-large.directive';

describe('x-large directive', () => {
  /**
   * Create a test component to test directives.
   */
  @Component({
    template: '<div x-large>Content</div>'
  })
  class TestComponent { }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        XLargeDirective,
        TestComponent
      ]
    });
  });

  it('should sent font-size to x-large', fakeAsync(() => {
    TestBed.compileComponents().then(() => {

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      tick();
      const element = fixture.debugElement.query(By.css('div'));

      expect(element.nativeElement.style.fontSize).toBe('x-large');

    });
  }));

});
