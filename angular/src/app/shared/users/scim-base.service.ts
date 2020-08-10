import { flatDeep } from 'ddap-common-lib';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import { scim } from '../proto/dam-service';

import IOperation = scim.v2.Patch.IOperation;
import { PathOperation } from './path-operation.enum';
import Operation = scim.v2.Patch.Operation;

export class ScimBaseService {

  protected static getOperations(newValue: string | boolean, path: string) {
    if (typeof newValue === 'boolean') {
      return this.getPatchOperationModel(PathOperation.replace, path, newValue);
    }
    if (!newValue || newValue === '') {
      return this.getPatchOperationModel(PathOperation.remove, path, '');
    }
    return this.getPatchOperationModel(PathOperation.replace, path, newValue);
  }

  protected static valueHasChanged(group, pathToValue, newValue) {
    const previousValue = _get(group, pathToValue);
    if (!previousValue && !newValue) {
      return false;
    }
    return !_isEqual(previousValue, newValue);
  }

  protected static getPatchOperationModel(operation: PathOperation, path: string, value: string | boolean): IOperation {
    return Operation.create({
      op: operation,
      path,
      value: `${value}`,
    });
  }

  protected static getPatchOperationModelForObject(operation: PathOperation, path: string, object: any): any {
    return {
      op: operation,
      path,
      object,
    };
  }

  protected static getListOfFullPathsToFields(rootPath: string, obj: any): string[] {
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
