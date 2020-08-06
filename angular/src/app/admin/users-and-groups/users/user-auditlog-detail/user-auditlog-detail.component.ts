import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../shared/users/user.service';

@Component({
  selector: 'ddap-users-auditlog-detail',
  templateUrl: './user-auditlog-detail.component.html',
  styleUrls: ['./user-auditlog-detail.component.scss'],
})
export class UserAuditlogDetailComponent implements OnInit {

  userDisplayName: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  get userId() {
    return this.route.snapshot.params.userId;
  }

  get auditLogId() {
    return this.route.snapshot.params.auditlogId;
  }

  ngOnInit() {
    this.userService.getUser(this.userId)
      .subscribe((user) => {
        this.userDisplayName = user.displayName;
      });
  }

}
