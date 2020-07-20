import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormValidationService } from 'ddap-common-lib';

import { WhitelistFormComponent } from '../whitelist-form/whitelist-form.component';
import { WhitelistsService } from '../whitelists.service';

@Component({
  selector: 'ddap-whitelist-manage',
  templateUrl: './whitelist-manage.component.html',
  styleUrls: ['./whitelist-manage.component.scss'],
})
export class WhitelistManageComponent {

  @ViewChild(WhitelistFormComponent)
  whitelistForm: WhitelistFormComponent;

  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private validationService: FormValidationService,
              private whitelistsService: WhitelistsService) {
  }

  save() {
    if (!this.validate(this.whitelistForm)) {
      return;
    }

    const whitelist: any = this.whitelistForm.getModel();
    this.whitelistsService.save(whitelist)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error);
  }

  protected displayFieldErrorMessage = (error) => {
    this.formErrorMessage = error;
    this.isFormValid = false;
    this.isFormValidated = true;
  }

  protected validate(form: Form): boolean {
    this.formErrorMessage = null;
    this.isFormValid = this.validationService.validate(form);
    this.isFormValidated = true;
    return this.isFormValid;
  }

  protected navigateUp = (path: string) => this.router.navigate([path], { relativeTo: this.route });

}
