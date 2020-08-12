import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import IGroup = scim.v2.IGroup;
import { DeleteActionConfirmationDialogComponent, Form, FormValidationService } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';

import { scim } from '../../../../shared/proto/dam-service';
import IPatch = scim.v2.IPatch;
import { ScimGroupService } from '../../../../shared/users/scim-group.service';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupService } from '../group.service';
import IOperation = scim.v2.Patch.IOperation;

@Component({
  selector: 'ddap-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {

  @ViewChild(GroupFormComponent)
  groupForm: GroupFormComponent;

  group$: Observable<IGroup>;
  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private validationService: FormValidationService,
    private groupService: GroupService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.group$ = this.route.params.pipe(
      switchMap((params) => {
        const { entityId } = params;
        return this.groupService.getGroup(entityId);
      }),
      share()
    );
  }

  openDeleteConfirmationDialog(groupId: string, groupName: string) {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: groupName,
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.delete(groupId);
        }
      });
  }

  delete(groupId: string): void {
    this.groupService.deleteGroup(groupId)
      .subscribe(() => this.navigateUp('..'), this.handleError);
  }

  update(group: IGroup) {
    if (!this.validate(this.groupForm)) {
      return;
    }

    const change: IPatch = ScimGroupService.getOperationsPatch(group, this.groupForm.getModel());
    const bulkEmails: IOperation[] = ScimGroupService.getOperationsPatchForBulkEmails(this.groupForm.getBulkEmailsModel());
    bulkEmails.forEach((operation) => change.operations.push(operation));
    this.groupService.patchGroup(group.id, change)
      .subscribe(() => this.navigateUp('..'), this.handleError);
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
