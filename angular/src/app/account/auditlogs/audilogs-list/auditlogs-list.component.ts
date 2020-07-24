import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Identity, IdentityAccount } from '../../identity/identity.model';
import { IdentityStore } from '../../identity/identity.store';
import { AuditlogsService } from '../auditlogs.service';

import { Decision } from './decision.enum';
import { LogType } from './log-type.enum';

@Component({
  selector: 'ddap-auditlogs-list',
  templateUrl: './auditlogs-list.component.html',
  styleUrls: ['./auditlogs-list.component.scss'],
})
export class AuditlogsListComponent implements OnInit {


  get logTypes() {
    return LogType;
  }

  get decisionType() {
    return Decision;
  }

  auditLogs$: Observable<object[]>;
  pageSize: FormControl = new FormControl('20');
  logType: FormControl = new FormControl(LogType.all);
  searchTextList: FormControl = new FormControl([]);
  decision: FormControl = new FormControl(Decision.all);
  account: IdentityAccount;
  searchTextValues: string[] = [];
  filter: string;
  disableSearchText: boolean;
  userId: string;
  displayName: string;
  readonly columnsToDisplay: string[] = ['auditlogId', 'type', 'time', 'decision', 'resourceName'];
  readonly separatorCodes: number[] = [ENTER];

  constructor( private identityStore: IdentityStore,
               private auditlogsService: AuditlogsService,
               private router: Router,
               private route: ActivatedRoute) { }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    this.userId = this.route.snapshot.params.entityId;
    if (Object.keys(queryParams).length) {
      const { pageSize, filter, displayName } = queryParams;
      this.displayName = displayName;
      this.filter = filter || '';
      if (pageSize) {
        this.pageSize.patchValue(pageSize);
      }
      this.updateFilters(decodeURIComponent(filter));
    } else {
      this.filter = encodeURIComponent(this.getFilters());
    }
    this.getDisplayName();
    if (!this.userId || !this.userId.length) {
      this.identityStore.state$.subscribe((identity: Identity) => {
        if (!identity) {
          return;
        }
        const {account} = identity;
        this.account = account;
        this.userId = account['sub'];
        this.getLogs();
      });
    } else {
      this.getLogs();
    }
  }

  getFilters(): string {
    let filter = '';
    if (this.logType.value.length > 0) {
      filter = `type="${this.logType.value}"`;
    }
    if (this.searchTextValues.length > 0) {
      if (filter.length > 0) {
        filter = filter + ` AND text:${this.searchTextValues.join(' OR ')}`;
      } else {
        filter = `text:${this.searchTextValues.join(' OR ')}`;
      }
    }
    if (this.decision.value.length > 0) {
      if (filter.length > 0) {
        filter = filter + `AND decision="${this.decision.value}"`;
      } else {
        filter = `decision="${this.decision.value}"`;
      }
    }
    return filter;
  }

  getLogs() {
    this.filter = encodeURIComponent(this.getFilters());
    const pageSize = this.pageSize.value;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {pageSize, filter: this.filter },
        queryParamsHandling: 'merge',
      }
    );
    this.auditlogsService.getLogs(this.userId, pageSize, this.filter)
      .subscribe(result => this.auditLogs$ = this.formatTableData(result['auditLogs']));
  }

  formatTableData(logs: object[] = []): Observable<object[]> {
    const auditLogs = [];
    logs.map(log => {
      const logDetail = Object.assign({}, log);
      logDetail['auditlogId'] = this.getIdFromName(log['name']);
      auditLogs.push(logDetail);
    });
    return of(auditLogs);
  }

  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

  gotoAuditlogDetail(log) {
    this.auditlogsService.setCurrentAuditlog(log);
    this.router.navigate([log.auditlogId], {relativeTo: this.route});
  }

  searchByText(event: MatChipInputEvent) {
    this.searchTextList.value.push(`text:${event.value}`);
    this.searchTextList.updateValueAndValidity();
    if (event.input) {
      event.input.value = '';
    }
    this.searchTextValues.push(`"${event.value}"`);
    this.disableSearchText = true;
    this.getLogs();
  }

  removeSearchText(searchText: string) {
    const searchTextValue = searchText.replace('text:', '');
    const searchTextListIndex = this.searchTextList.value.indexOf(searchText);
    const searchTextValuesIndex =  this.searchTextValues.indexOf(`"${searchTextValue}"`);
    if (searchTextListIndex > -1) {
      this.searchTextList.value.splice(searchTextListIndex, 1);
      this.searchTextList.updateValueAndValidity();
    }
    if (searchTextValuesIndex > -1) {
      this.searchTextValues.splice(searchTextValuesIndex, 1);
    }
    this.disableSearchText = false;
    this.getLogs();
  }

  getDisplayName() {
    return this.displayName ? `Auditlogs of ${this.displayName}` : 'Auditlogs';
  }

  formatTime(timeString: string): Date {
    return new Date(timeString);
  }

  private updateFilters(filters: string) {
    filters.split('AND').map(filter => {
      if (filter.indexOf('type=') !== -1) {
        this.logType.patchValue(filter.replace('type=', '')
          .replace(/\s|["]/g, ''));
        this.logType.updateValueAndValidity();
      }
      if (filter.trim().indexOf('text:') !== -1) {
        this.searchTextList.value.push(filter.replace(/\s|["]/g, ''));
        this.searchTextList.updateValueAndValidity();
        this.searchTextValues.push(filter.trim().replace('text:', ''));
        this.disableSearchText = true;
      }
      if (filter.indexOf('decision=') !== -1) {
        this.decision.patchValue(filter.replace('decision=', '')
          .replace(/\s|["]/g, ''));
        this.decision.updateValueAndValidity();
      }
    });
  }
}
