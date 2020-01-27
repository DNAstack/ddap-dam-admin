import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { IdentityStore } from '../../../identity/identity.store';
import { RealmService } from '../realm.service';

import { RealmChangeConfirmationDialogModel } from './realm-change-confirmation-dialog.model';

@Component({
  selector: 'ddap-realm-change-confirmation',
  templateUrl: './realm-change-confirmation-dialog.component.html',
  styleUrls: ['./realm-change-confirmation-dialog.component.scss'],
})
export class RealmChangeConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<RealmChangeConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: RealmChangeConfirmationDialogModel,
              private identityStore: IdentityStore,
              private realmService: RealmService,
              private router: Router) {
    dialogRef.afterClosed().subscribe(acknowledged => {
      if (acknowledged) {
        if (this.data.action === 'edit') {
          this.changeRealmAndGoToLogin();
        } else if (this.data.action === 'delete') {
          this.deleteRealm();
        }
      }
    });
  }

  private changeRealmAndGoToLogin() {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `/api/v1alpha/realm/${this.data.realm}/identity/login?loginHint=${loginHint}`;
      });
  }

  private deleteRealm() {
    if (this.data.realm !== 'master') {
      this.realmService.deleteRealm(this.data.realm).subscribe(() => {
        this.router.navigate(['/master']).then(() => window.location.reload());
      });
    }
  }
}
