import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  users:any;

  constructor(private userService:UserService) {}

  ngOnInit(){
    this.userService.getUsers().subscribe(response => {
      this.users = response;});
  }

  onSubmit(form: NgForm)
  {
    this.userService.editUser(form.value.user_id,form.value.name,form.value.email);
  }
}
