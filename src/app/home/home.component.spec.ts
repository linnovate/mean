import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  inject,
  async,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

/**
 * Load the implementations that should be tested.
 */
import { AppState } from '../app.service';
import { HomeComponent } from './home.component';
import { Title } from './title';

describe(`Home`, () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  /**
   * async beforeEach.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppState,
        Title,
      ]
    })
    /**
     * Compile template and css.
     */
    .compileComponents();
  }));

  /**
   * Synchronous beforeEach.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    comp = fixture.componentInstance;

    /**
     * Trigger initial data binding.
     */
    fixture.detectChanges();
  });

  it('should have default data', () => {
    expect(comp.localState).toEqual({ value: '' });
  });

  it('should have a title', () => {
    expect(!!comp.title).toEqual(true);
  });

  it('should log ngOnInit', () => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    comp.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  });

});
