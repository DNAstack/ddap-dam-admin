import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormValidationService } from 'ddap-common-lib';

import { scim } from '../../../../shared/proto/dam-service';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupService } from '../group.service';
import IGroup = scim.v2.IGroup;

@Component({
  selector: 'ddap-group-manage',
  templateUrl: './group-manage.component.html',
  styleUrls: ['./group-manage.component.scss'],
})
export class GroupManageComponent {

  @ViewChild(GroupFormComponent)
  groupForm: GroupFormComponent;

  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: FormValidationService,
    private groupService: GroupService
  ) {
  }

  save() {
    if (!this.validate(this.groupForm)) {
      return;
    }

    const group: IGroup = this.groupForm.getModel();
    this.groupService.createGroup(group.id, group)
      .subscribe(() => this.navigateUp('../..'), this.handleError);
  }

  handleError = ({ error }) => {
    this.displayFieldErrorMessage(error?.message);
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
