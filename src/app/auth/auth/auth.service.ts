import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'abc';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  get userId() {
    return this._userId;
  }

  login() {
    this._userIsAuthenticated = true;
    //afiche le userid dans la console
    console.log(this._userId);
  }
  logout() {
    this._userIsAuthenticated = false;
  }
  constructor() { }
}
