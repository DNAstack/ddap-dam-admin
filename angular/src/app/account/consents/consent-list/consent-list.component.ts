import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../shared/users/user.service';


@Component({
  selector: 'ddap-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.scss'],
})
export class ConsentListComponent implements OnInit {

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
