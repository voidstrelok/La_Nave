import { Injectable } from '@angular/core';
import { LaNaveAPIService } from './lanaveapi.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  public API = this._api;

  constructor(private _api: LaNaveAPIService) { 
  }

}
