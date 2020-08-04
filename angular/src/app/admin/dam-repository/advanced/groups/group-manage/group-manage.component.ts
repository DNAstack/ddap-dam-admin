import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormValidationService } from 'ddap-common-lib';

import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'ddap-group-manage',
  templateUrl: './group-manage.component.html',
  styleUrls: ['./group-manage.component.scss'],
})
export class GroupManageComponent {

  @ViewChild(GroupFormComponent)
  whitelistForm: GroupFormComponent;

  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private validationService: FormValidationService,
              private whitelistsService: GroupsService) {
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
