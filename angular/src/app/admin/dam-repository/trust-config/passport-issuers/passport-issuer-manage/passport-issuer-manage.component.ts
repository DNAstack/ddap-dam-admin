import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { dam } from '../../../../../shared/proto/dam-service';
import { DamConfigEntityFormComponentBase } from '../../../shared/dam/dam-config-entity-form-component.base';
import { PassportIssuerFormComponent } from '../passport-issuer-form/passport-issuer-form.component';
import { PassportIssuerService } from '../passport-issuers.service';
import TrustedIssuer = dam.v1.TrustedIssuer;

@Component({
  selector: 'ddap-passport-issuer-manage',
  templateUrl: './passport-issuer-manage.component.html',
  styleUrls: ['./passport-issuer-manage.component.scss'],
  providers: [FormValidationService],
})
export class PassportIssuerManageComponent extends DamConfigEntityFormComponentBase implements OnInit {

  @ViewChild(PassportIssuerFormComponent)
  passportIssuerForm: PassportIssuerFormComponent;

  passportIssuer: TrustedIssuer;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              private passportIssuerService: PassportIssuerService) {
    super(route, router, validationService);
  }

  ngOnInit(): void {
    this.passportIssuer = TrustedIssuer.create({});
  }

  save() {
    this.passportIssuerForm.validateClientCredentials();
    if (!this.validate(this.passportIssuerForm)) {
      return;
    }

    const personaModel: EntityModel = this.passportIssuerForm.getModel();
    const clientSecret = this.passportIssuerForm.form.get('clientSecret').value;
    const change = new ConfigModificationModel(personaModel.dto, {}, clientSecret);
    this.passportIssuerService.save(personaModel.name, change)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error, 'trustedPassportIssuer', this.passportIssuerForm.form);
  }

}
