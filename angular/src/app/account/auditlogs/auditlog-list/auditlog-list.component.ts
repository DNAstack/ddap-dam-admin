import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../shared/users/user.service';

@Component({
  selector: 'ddap-account-auditlog-list',
  templateUrl: './auditlog-list.component.html',
  styleUrls: ['./auditlog-list.component.scss'],
})
export class AuditlogListComponent implements OnInit {

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
