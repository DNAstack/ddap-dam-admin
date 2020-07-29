import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DeleteActionConfirmationDialogComponent,
  FormValidationService,
  SecretGeneratedDialogComponent,
} from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { DamConfigEntityFormComponentBase } from '../../../shared/dam/dam-config-entity-form-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { ClientApplicationFormComponent } from '../client-application-form/client-application-form.component';
import { ClientApplicationService } from '../client-applications.service';

@Component({
  selector: 'ddap-client-application-manage',
  templateUrl: './client-application-manage.component.html',
  styleUrls: ['./client-application-manage.component.scss'],
  providers: [FormValidationService],
})
export class ClientApplicationManageComponent extends DamConfigEntityFormComponentBase {

  @ViewChild(ClientApplicationFormComponent)
  clientApplicationForm: ClientApplicationFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    private dialog: MatDialog,
    private clientApplicationService: ClientApplicationService
  ) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.clientApplicationForm)) {
      return;
    }

    const clientApplication: EntityModel = this.clientApplicationForm.getModel();
    const change = new ConfigModificationModel(clientApplication.dto, {});
    this.clientApplicationService.save(clientApplication.name, change)
      .subscribe(
        (response) => {
          const secret = response.client_secret;
          if (secret) {
            this.openConfirmationDialog(secret);
          } else {
            this.navigateUp('../..');
          }
        },
        this.handleError
      );
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.clientApplicationForm.form);
  }

  openConfirmationDialog(secretValue: string) {
    this.dialog.open(SecretGeneratedDialogComponent, {
      disableClose: true, // prevent closing dialog by clicking on backdrop
      data: {
        secretLabel: 'client secret',
        secretValue,
      },
    }).afterClosed()
      .subscribe(({ acknowledged }) => {
        if (acknowledged) {
          this.navigateUp('../..');
        }
      });
  }

}
