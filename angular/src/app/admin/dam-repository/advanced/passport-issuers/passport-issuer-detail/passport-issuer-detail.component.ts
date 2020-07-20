import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { DamConfigEntityDetailComponentBaseDirective } from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import {
  EntityRemovalConfirmationDialogComponent
} from '../../../shared/entity-removal-confirmation-dialog/entity-removal-confirmation-dialog.component';
import { PassportIssuerFormComponent } from '../passport-issuer-form/passport-issuer-form.component';
import { PassportIssuerService } from '../passport-issuers.service';
import { PassportIssuersStore } from '../passport-issuers.store';

@Component({
  selector: 'ddap-passport-issuer-detail',
  templateUrl: './passport-issuer-detail.component.html',
  styleUrls: ['./passport-issuer-detail.component.scss'],
  providers: [FormValidationService],
})
export class PassportIssuerDetailComponent extends DamConfigEntityDetailComponentBaseDirective<PassportIssuersStore> implements OnInit {

  @ViewChild(PassportIssuerFormComponent)
  passportIssuerForm: PassportIssuerFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              protected damConfigStore: DamConfigStore,
              protected passportIssuersStore: PassportIssuersStore,
              private passportIssuerService: PassportIssuerService,
              public dialog: MatDialog) {
    super(route, router, validationService, damConfigStore, passportIssuersStore);
  }

  update() {
    if (!this.validate(this.passportIssuerForm)) {
      return;
    }

    const passportIssuer: EntityModel = this.passportIssuerForm.getModel();
    const change = new ConfigModificationModel(passportIssuer.dto, {});
    this.passportIssuerService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.showErrorMessage);
  }

  delete() {
    this.passportIssuerService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.showErrorMessage);
  }

  showErrorMessage = ({ error }: HttpErrorResponse) => {
    // TODO handle this
    if (error && ('testPersonas' in error)) {
      this.openEntityRemovalConfirmationDialog(error);
      return;
    }
    this.handleError(error);
  }

  handleError = (error) => {
    this.displayFieldErrorMessage(error, 'trustedPassportIssuer', this.passportIssuerForm.form);
  }

  private openEntityRemovalConfirmationDialog(accessChange): void {
    const testPersonas = Object.keys(accessChange.testPersonas);
    const dialogRef = this.dialog.open(EntityRemovalConfirmationDialogComponent, {
      data: { testPersonas },
    });
    dialogRef.afterClosed().subscribe(acknowledged => {
      if (!acknowledged) {
        return;
      }
      const change = new ConfigModificationModel(this.passportIssuerForm.getModel().dto, accessChange);
      this.passportIssuerService.remove(this.entity.name, change)
        .subscribe(() => this.navigateUp('..'));
    });
  }

}
