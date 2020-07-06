import { flatDeep } from 'ddap-common-lib';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import { scim } from '../proto/dam-service';

import IOperation = scim.v2.Patch.IOperation;
import { PathOperation } from './path-operation.enum';
import Operation = scim.v2.Patch.Operation;
import IUser = scim.v2.IUser;
import Patch = scim.v2.Patch;
import IPatch = scim.v2.IPatch;

export class ScimService {

  public static getOperationsPatch(user: IUser, formValues: any): IPatch {
    const pathsToFields = this.getListOfFullPathsToFields('', {
      active: formValues.active,
      displayName: formValues.displayName,
      name: formValues.name,
      locale: formValues.locale,
      preferredlanguage: formValues.preferredLanguage,
      timezone: formValues.timezone,
      emails: formValues.emails,
      photos: formValues.photos,
    });

    const operations: IOperation[] = pathsToFields
      .filter((path) => this.valueHasChanged(user, path, _get(formValues, path)))
      .map((path) => {
        const newValue: string | boolean = _get(formValues, path);
        // Special case for emails update
        if (path.includes('emails.')) {
          return this.emailValueReplaceOperation(user, path, newValue);
        }
        return this.getOperations(newValue, path);
      });

    return Patch.create({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations,
    });
  }

  public static getAccountLinkPatch(refValue: string): IPatch {
    const operation = this.getPatchOperationModel(PathOperation.add, 'emails', 'X-Link-Authorization');
    return Patch.create({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations: [operation],
    });
  }

  public static getAccountUnlinkPatch(refValue: string): IPatch {
    const path = `emails[$ref eq "${refValue}"]`;
    const operation = this.getPatchOperationModel(PathOperation.remove, path, '');
    return Patch.create({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations: [operation],
    });
  }

  private static getOperations(newValue: string | boolean, path: string) {
    if (typeof newValue === 'boolean') {
      return this.getPatchOperationModel(PathOperation.replace, path, newValue);
    }
    if (!newValue || newValue === '') {
      return this.getPatchOperationModel(PathOperation.remove, path, '');
    }
    return this.getPatchOperationModel(PathOperation.replace, path, newValue);
  }

  private static emailValueReplaceOperation(user, pathToValue: string, newValue) {
    if (pathToValue.includes('.primary')) {
      const pathToRefValue = pathToValue.replace('.primary', '.$ref');
      const refValue = _get(user, pathToRefValue);
      const path = `emails[$ref eq "${refValue}"].primary`;
      return this.getPatchOperationModel(PathOperation.replace, path, newValue);
    }
    return this.getOperations(newValue, pathToValue);
  }

  private static valueHasChanged(user, pathToValue, newValue) {
    const previousValue = _get(user, pathToValue);
    if (!previousValue && !newValue) {
      return false;
    }
    return !_isEqual(previousValue, newValue);
  }

  private static getPatchOperationModel(operation: PathOperation, path: string, value: string | boolean): IOperation {
    return Operation.create({
      op: operation,
      path,
      value: `${value}`,
    });
  }

  private static getListOfFullPathsToFields(rootPath: string, obj: any): string[] {
    const concatPaths = (parentPath: string, key: string): string => {
      return parentPath !== '' ? `${parentPath}.${key}` : `${key}`;
    };

    const paths = [];
    Object.entries(obj).forEach(([key, value]) => {
      const path = concatPaths(rootPath, key);
      if (value instanceof Object) {
        paths.push(this.getListOfFullPathsToFields(path, value));
      } else {
        paths.push(path);
      }
    });
    return flatDeep(paths);
  }

}
