import { AfterViewInit, Component } from '@angular/core';
import { main } from './game/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';

  ngAfterViewInit() {
    main();
  }
}
