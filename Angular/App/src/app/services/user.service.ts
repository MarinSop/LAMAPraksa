import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:3000/';
  constructor(private httpClient:HttpClient) { }

  getUsers()
  {
    return this.httpClient.get(this.url + 'users');
  }

  getPostByUserId(userId : Number)
  {
    return this.httpClient.get(this.url + 'posts/' + userId);
  }

  putUser(name: string, email: string)
  {
    this.httpClient.put<any>(this.url+'users?name=' + name + '&email=' + email,{}).subscribe();
  
  }

  editUser(userID: number, name: string, email: string)
  {
    this.httpClient.post<any>(this.url+'users?userID='+ userID +'&name=' + name + '&email=' + email,{}).subscribe();
    console.log(this.url+'users?userID='+ userID +'&name=' + name + '&email=' + email);
  }
}
