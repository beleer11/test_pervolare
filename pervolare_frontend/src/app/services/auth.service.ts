import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Variables
  authUrl = 'http://localhost:8000/oauth/token';
  apiUrl = 'http://localhost:8000/api';
  registerUrl = 'http://localhost:8000/api/register'

  /**
   * Constructor
   * @param http The http client object
   */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get an access token
   * @param e The email address
   * @param p The password string
   */
  login(e: string, p: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.authUrl, {
      grant_type: 'password',
      client_id: '16',
      client_secret: 'DrWdZor8d4wLzSk0c4ADKFJJDfccWdpnr6XJw9hP',
      username: e,
      password: p,
      scope: ''
    }, options);
  }

  /**
   * Revoke the authenticated user token
   */
  logout() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get(this.apiUrl + '/token/revoke', options);
  }

  register(data: { username: any; email: any; password: any; }){
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.registerUrl, {
      data : data
    }, options);
  }

}
