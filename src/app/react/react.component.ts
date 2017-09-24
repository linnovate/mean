import { Component, OnInit } from '@angular/core';
import ReactView from 'react-view';
import HelloReact from './hello-react';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './react.component.scss' ],
  templateUrl: './react.component.html'
})
export class ReactComponent implements OnInit {
    public ngOnInit(){
        ReactView.render(HelloReact, 'react-root');
    }
}
