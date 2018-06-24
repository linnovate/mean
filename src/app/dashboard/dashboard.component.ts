import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) {
    (window as any).globalEvents.on('open error dialog', data => {
      this.snackBar.open(data, 'close', {
        duration: 2000
      });
    });
  }

  ngOnInit() {}

}
