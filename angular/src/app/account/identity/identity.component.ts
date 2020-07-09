import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { scim } from '../../shared/proto/dam-service';
import { PersonalInfoFormComponent } from '../../shared/users/personal-info-form/personal-info-form.component';
import {
  UserAccountCloseConfirmationDialogComponent
} from '../../shared/users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { UserService } from '../../shared/users/user.service';

import IUser = scim.v2.IUser;
import { IdentityService } from './identity.service';
import { IdentityStore } from './identity.store';

@Component({
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit {

  @ViewChild(PersonalInfoFormComponent, { static: false })
  personalInfoForm: PersonalInfoFormComponent;

  realm: string;
  userInfo$: Observable<IUser>;

  constructor(private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
    });

    this.userInfo$ = this.userService.getLoggedInUser();
  }

  updatePersonalInfo(): void {
    const change = this.personalInfoForm.getModel();
    this.userService.patchLoggedInUser(change)
      .subscribe(() => this.openSnackBar('Successfully update personal information. To take effect reload the page.'));
  }

  closeAccount(user: IUser) {
    const dialogRef = this.dialog.open(UserAccountCloseConfirmationDialogComponent, {
      data: {
        selfClosing: true,
      },
    });
    dialogRef.afterClosed().subscribe((acknowledged) => {
      if (acknowledged) {
        this.userService.deleteUser(user.id)
            .pipe(
                flatMap(() => this.identityService.invalidateAccessTokens())
            )
            .subscribe(() => window.location.href = `/`);
      }
    });
  }

  private openSnackBar(message) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

}
