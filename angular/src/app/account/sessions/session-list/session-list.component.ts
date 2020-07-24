import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../shared/users/user.service';

@Component({
  selector: 'ddap-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit {

  userId: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser()
      .subscribe((user) => {
        this.userId = user.id;
      });
  }

}
