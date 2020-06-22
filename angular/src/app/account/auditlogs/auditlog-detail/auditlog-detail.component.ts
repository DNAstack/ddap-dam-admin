import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { AuditlogsService } from '../auditlogs.service';

@Component({
  selector: 'ddap-auditlog-detail',
  templateUrl: './auditlog-detail.component.html',
  styleUrls: ['./auditlog-detail.component.scss'],
})
export class AuditlogDetailComponent implements OnInit, OnDestroy {
  auditLog: object;

  constructor(private auditlogsService: AuditlogsService,
              private route: ActivatedRoute,
              @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    this.auditlogsService.currentAuditlog.subscribe(log => {
      if (Object.keys(log).length > 0) {
        this.auditLog = log;
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

  private fetchDetailsFromStorage() {
    const auditlogId = this.route.snapshot.params.auditlogId;
    if (this.storage.get('auditlog')) {
      const logDetails = JSON.parse(this.storage.get('auditlog'));
      this.auditLog = (logDetails.auditlogId === auditlogId) ? logDetails : {};
    }
  }
}
