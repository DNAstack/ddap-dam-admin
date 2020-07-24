import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';

import { JsonEditorDefaults } from '../../../json-editor-defaults';
import { AuditlogDetailStateService } from '../auditlog-detail-state.service';

@Component({
  selector: 'ddap-auditlog-detail',
  templateUrl: './auditlog-detail.component.html',
  styleUrls: ['./auditlog-detail.component.scss'],
})
export class AuditlogDetailComponent implements OnInit, OnDestroy {

  auditLog: object;
  editorOptions: JsonEditorOptions;
  jsonData: JSON;

  @Input()
  auditLogId: string;

  constructor(private auditlogDetailStateService: AuditlogDetailStateService) {
    this.editorOptions = new JsonEditorDefaults();
  }

  ngOnInit(): void {
    const auditLog = this.auditlogDetailStateService.getAuditLog();
    if (auditLog) {
      this.auditLog = (auditLog.auditlogId === this.auditLogId) ? auditLog : {};
      this.toJSON();
    }
  }

  toWords(key: string): string {
    return key.replace(/([A-Z])/g, ' $1');
  }

  ngOnDestroy(): void {
    this.auditlogDetailStateService.removeAuditLog();
  }

  isJson(value: string): boolean {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }

  toJSON() {
    try {
      this.jsonData = JSON.parse(this.auditLog['reason']);
    } catch (e) {
      console.error('String');
    }
  }

}
