import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  users:any;
  constructor(private userService:UserService) {}


  ngOnInit(){
    this.userService.getUsers().subscribe(response => {
      this.users = response;
      for(let u of this.users)
      {
        this.userService.getPostByUserId(u.id).subscribe(postRes => {u.posts = postRes;});
      }
    });
  }
}

