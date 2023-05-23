import { Component } from '@angular/core';
import { AlertService } from './shared/alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'prism-health-lab';

  constructor(private _alertService: AlertService)
  {}
}
