import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import { scim } from '../proto/dam-service';

import { PathOperation } from './path-operation.enum';
import { ScimBaseService } from './scim-base.service';
import IOperation = scim.v2.Patch.IOperation;

import IGroup = scim.v2.IGroup;
import IMember = scim.v2.IMember;

export class ScimGroupService extends ScimBaseService {

  public static getOperationsPatch(group: IGroup, formValues: any): any {
    const pathsToFields = this.getListOfFullPathsToFields('', {
      displayName: formValues.displayName,
    });

    const operations: IOperation[] = pathsToFields
      .filter((path) => this.valueHasChanged(group, path, _get(formValues, path)))
      .map((path) => {
        const newValue: string | boolean = _get(formValues, path);
        return this.getOperations(newValue, path);
      });


    if (this.memberValueHasChanged(group, formValues.members)) {
      // 1. Remove all
      group.members?.forEach((member: IMember) => {
        operations.push(this.getPatchOperationModel(PathOperation.remove, `members[$ref eq "${member['$ref']}"]`, ''));
      });
      // 2. (re-)Add only those who are in form
      formValues.members.forEach((memberToAdd) => {
        operations.push(this.getPatchOperationModelForObject(PathOperation.add, 'members', memberToAdd));
      });
    }

    return {
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations,
    };
  }

  public static getOperationsPatchForBulkEmails(emails: string[]): IOperation[] {
    const operations: IOperation[] = [];
    emails.forEach((email) => {
      operations.push(this.getPatchOperationModelForObject(PathOperation.add, 'members', {
        type: 'User',
        value: email,
      }));
    });

    return operations;
  }

  private static memberValueHasChanged(group: IGroup, newValue: IMember[]) {
    const previousValue = _get(group, 'members');
    if (!previousValue && !newValue) {
      return false;
    }
    return !_isEqual(previousValue, newValue);
  }

}
