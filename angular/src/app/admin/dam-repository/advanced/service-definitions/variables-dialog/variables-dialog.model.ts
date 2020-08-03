import { dam } from '../../../../../shared/proto/dam-service';
import IVariableFormat = dam.v1.IVariableFormat;

export interface VariablesDialogModel {
  variables: { [key: string]: IVariableFormat };
  interfaceKey: string;
}
