import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ddap-variables-dialog',
  templateUrl: './variables-dialog.component.html',
  styleUrls: ['./variables-dialog.component.scss'],
})
export class VariablesDialogComponent {
  selectedVariable: string;
  constructor(public dialogRef: MatDialogRef<VariablesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    dialogRef.afterClosed().subscribe(acknowledged => {
      if (acknowledged) {
        data.updateVariable(this.selectedVariable, data.interfaceKey);
      }
    });
  }

}
