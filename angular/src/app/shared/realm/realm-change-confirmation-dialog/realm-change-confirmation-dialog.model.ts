export interface RealmChangeConfirmationDialogModel {
  realm: string;
  action: ActionType;
}

export type ActionType = 'edit' | 'delete';
