import { Component } from '@angular/core';
import * as schema from './schema/equipment.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  schema = schema;
  json = {
    name: 'something'
  };
  title = 'app';
}
