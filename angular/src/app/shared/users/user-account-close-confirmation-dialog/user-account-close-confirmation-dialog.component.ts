import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserAccountCloseConfirmationDialogModel } from './user-account-close-confirmation-dialog.model';

@Component({
  selector: 'ddap-user-account-close-confirmation',
  templateUrl: './user-account-close-confirmation-dialog.component.html',
  styleUrls: ['./user-account-close-confirmation-dialog.component.scss'],
})
export class UserAccountCloseConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<UserAccountCloseConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserAccountCloseConfirmationDialogModel) {
  }

}
