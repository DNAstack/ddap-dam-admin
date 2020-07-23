import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { JsonEditorDefaults } from '../../../shared/json-editor-defaults';
import { AuditlogsService } from '../auditlogs.service';

@Component({
  selector: 'ddap-auditlog-detail',
  templateUrl: './auditlog-detail.component.html',
  styleUrls: ['./auditlog-detail.component.scss'],
})
export class AuditlogDetailComponent implements OnInit, OnDestroy {

  auditLog: object;
  editorOptions: JsonEditorOptions;
  jsonData: JSON;

  constructor(private auditlogsService: AuditlogsService,
              private route: ActivatedRoute,
              @Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.editorOptions = new JsonEditorDefaults();
  }

  ngOnInit() {
    this.auditlogsService.currentAuditlog$.subscribe(log => {
      if (Object.keys(log).length > 0) {
        this.auditLog = log;
        this.toJSON();
        this.storage.set('auditlog', JSON.stringify(log));
      } else {
        this.fetchDetailsFromStorage();
      }
    });
  }

  toWords(key: string): string {
    return key.replace(/([A-Z])/g, ' $1');
  }

  ngOnDestroy(): void {
    this.storage.remove('auditlog');
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

  private fetchDetailsFromStorage() {
    const auditlogId = this.route.snapshot.params.auditlogId;
    if (this.storage.get('auditlog')) {
      const logDetails = JSON.parse(this.storage.get('auditlog'));
      this.auditLog = (logDetails.auditlogId === auditlogId) ? logDetails : {};
      this.toJSON();
    }
  }
}
