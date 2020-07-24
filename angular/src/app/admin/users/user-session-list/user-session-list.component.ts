import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../shared/users/user.service';

@Component({
  selector: 'ddap-user-session-list',
  templateUrl: './user-session-list.component.html',
  styleUrls: ['./user-session-list.component.scss'],
})
export class UserSessionListComponent implements OnInit {

  userDisplayName: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  get userId() {
    return this.route.snapshot.params.userId;
  }

  ngOnInit() {
    this.userService.getUser(this.userId)
      .subscribe((user) => {
        this.userDisplayName = user.displayName;
      });
  }

}
