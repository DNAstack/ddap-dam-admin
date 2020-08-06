import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VariablesDialogModel } from './variables-dialog.model';

@Component({
  selector: 'ddap-variables-dialog',
  templateUrl: './variables-dialog.component.html',
  styleUrls: ['./variables-dialog.component.scss'],
})
export class VariablesDialogComponent {

  selectedVariableControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<VariablesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VariablesDialogModel) {
  }

}
