import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService, SecretGeneratedDialogComponent } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import {
  DamConfigEntityDetailComponentBaseDirective
} from '../../../shared/dam/dam-config-entity-detail-component.base';
import { DamConfigEntityType } from '../../../shared/dam/dam-config-entity-type.enum';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { ClientApplicationFormComponent } from '../client-application-form/client-application-form.component';
import { ClientApplicationService } from '../client-applications.service';
import { ClientApplicationsStore } from '../client-applications.store';

@Component({
  selector: 'ddap-client-application-detail',
  templateUrl: './client-application-detail.component.html',
  styleUrls: ['./client-application-detail.component.scss'],
  providers: [FormValidationService],
})
export class ClientApplicationDetailComponent
  extends DamConfigEntityDetailComponentBaseDirective<ClientApplicationsStore>
  implements OnInit {

  @ViewChild(ClientApplicationFormComponent)
  clientApplicationForm: ClientApplicationFormComponent;
  rotateSecret = false;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected damConfigStore: DamConfigStore,
    protected clientApplicationsStore: ClientApplicationsStore,
    protected dialog: MatDialog,
    private clientApplicationService: ClientApplicationService
  ) {
    super(route, router, validationService, damConfigStore, clientApplicationsStore, dialog);
  }

  update() {
    if (!this.validate(this.clientApplicationForm)) {
      return;
    }

    const clientApplication: EntityModel = this.clientApplicationForm.getModel();
    const change = new ConfigModificationModel(clientApplication.dto, {});
    this.clientApplicationService.update(this.entity.name, change, this.rotateSecret)
      .subscribe((response) => {
        const clientSecret = response.client_secret;
        if (clientSecret) {
          this.openSecretGeneratedDialog(clientSecret);
        } else {
          this.navigateUp('..');
        }
      }, this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.clientApplicationForm.form);
  }

  updateRotateSecret(event: MatCheckboxChange) {
    this.rotateSecret = event.checked;
  }

  openSecretGeneratedDialog(secretValue: string) {
    this.dialog.open(SecretGeneratedDialogComponent, {
      disableClose: true, // prevent closing dialog by clicking on backdrop
      data: {
        secretLabel: 'client secret',
        secretValue,
      },
    }).afterClosed()
      .subscribe(({ acknowledged }) => {
        if (acknowledged) {
          this.navigateUp('..');
        }
      });
  }

  protected delete() {
    this.clientApplicationService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }
}
