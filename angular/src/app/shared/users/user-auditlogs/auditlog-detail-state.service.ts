import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const storageKey = 'AUDITLOG';

@Injectable({
  providedIn: 'root',
})
export class AuditlogDetailStateService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  saveAuditLog(auditLog: any) {
    this.storage.set(storageKey, JSON.stringify(auditLog));
  }

  getAuditLog(): any | undefined {
    return this.storage.has(storageKey)
      ? JSON.parse(this.storage.get(storageKey))
      : undefined;
  }

  removeAuditLog() {
    this.storage.remove(storageKey);
  }

}
