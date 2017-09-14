import { Component, OnInit } from '@angular/core';
import ReactView from 'react-view';
import HelloReact from './hello-react';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    public ngOnInit(){
        ReactView.render(HelloReact, 'react-root');
    }
}