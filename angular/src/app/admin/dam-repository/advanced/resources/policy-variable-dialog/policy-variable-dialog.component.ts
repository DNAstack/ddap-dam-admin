import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ddap-policy-variable-dialog',
  templateUrl: './policy-variable-dialog.component.html',
  styleUrls: ['./policy-variable-dialog.component.scss'],
})

export class PolicyVariableDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PolicyVariableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.data['varsFormGroup'].valid) {
      this.data.onClick();
    }
  }

}
