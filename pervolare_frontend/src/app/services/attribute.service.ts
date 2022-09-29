import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  public urlBase = "http://localhost:8000/api/";
  /**
   * Constructor
   * @param http The http client object
   */
  constructor(
    private http: HttpClient
  ) { }

  storeAttribute(data: { name: any; type_id: any; }){
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.post(this.urlBase + 'attribute/store', { data }, options);
  }

  getType(){
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get(this.urlBase + "attribute/getType", options);
  }

  getAttributes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get(this.urlBase + "attribute/getAttributes", options);
  }

  list() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get(this.urlBase + "attribute/index", options);
  }

  delete(id: number) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.delete(this.urlBase+ 'attribute/delete/' + id, options);
  }

  getInfoProducto(id:any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get(this.urlBase + "attribute/show/" + id, options);
  }

  updateAttribute(data: { name: any; type_id: any; }, id: string | number | undefined){
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.post(this.urlBase + 'attribute/update/' + id, { data }, options);
  }

}
