import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-module',
  template: `
    <h1>Hello from Admin Component</h1>
  `,
})
export class AdminComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `AdminComponent` component');
  }

}
