import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';

import {environment} from '../environments/environment';

import {BthlesService, LinkCreateResponse} from './bthles.service';

enum BthlesState {
  Init,
  Submitted,
  ShortReceived
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  bthlesState = BthlesState;
  url: string;
  shortUrl: string;
  state = BthlesState.Init;

  constructor(
      private readonly bthlesService: BthlesService,
      private snackBar: MatSnackBar) {}

  submit() {
    if (this.state > BthlesState.Init) return;
    this.state = BthlesState.Submitted;
    this.bthlesService.createLink(this.url).subscribe(
        (response: LinkCreateResponse) => {
          this.shortUrl = `${environment.baseUrl}/${response.short}`;
          this.state = BthlesState.ShortReceived;
        });
  }

  copy(event: MouseEvent) {
    const input = event.srcElement as HTMLInputElement;
    input.select();
    document.execCommand('copy');

    this.snackBar.open('Copied to clipboard', 'OK', {duration: 3000});
  }
}
