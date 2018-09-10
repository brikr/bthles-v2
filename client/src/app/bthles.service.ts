import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '../environments/environment';

export interface LinkCreateResponse {
  error: boolean, short: string|null, existed: boolean
}

@Injectable({providedIn: 'root'})
export class BthlesService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  createLink(url: string) {
    return this.httpClient.post(`${this.baseUrl}/_create`, {
      url: url,
    });
  }
}
