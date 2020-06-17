import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Identity, IdentityAccount } from '../../../../../identity/identity.model';
import { IdentityStore } from '../../../../../identity/identity.store';
import { AuditlogsService } from '../auditlogs.service';

@Component({
  selector: 'ddap-auditlogs-list',
  templateUrl: './auditlogs-list.component.html',
  styleUrls: ['./auditlogs-list.component.scss'],
})
export class AuditlogsListComponent implements OnInit {

  auditLogs$: Observable<object[]>;
  pageSize = '20';
  logType = '';
  searchTextList: string[] = [];
  account: IdentityAccount;
  columnsToDisplay: string[];
  searchTextValues: string[] = [];
  readonly separatorCodes: number[] = [ENTER];

  constructor( private identityStore: IdentityStore,
               private auditlogsService: AuditlogsService,
               private router: Router,
               private route: ActivatedRoute) { }

  ngOnInit() {
    this.columnsToDisplay = ['auditlogId', 'type'];
    const filter = encodeURIComponent(this.getFilters());
    this.identityStore.state$.pipe(
      map((identity: Identity) => {
        if (!identity) {
          return;
        }
        const {account} = identity;
        this.account = account;
        return account;
      }),
      mergeMap(account => this.auditlogsService.getLogs(account['sub'], this.pageSize, filter))
    ).subscribe(result => {
      this.auditLogs$ = this.formatTableData(result['auditLogs']);
    });
  }

  getFilters(): string {
    let filter = '';
    if (this.logType.length > 0) {
      filter = `type="${this.logType}"`;
    } else {
      filter = '';
    }
    if (this.searchTextValues.length > 0) {
      if (filter.length > 0) {
        filter = filter + ` AND text:${this.searchTextValues.join(' OR ')}`;
      } else {
        filter = `text:${this.searchTextValues.join(' OR ')}`;
      }
    }
    return filter;
  }

  getLogs() {
    const filter = encodeURIComponent(this.getFilters());
    this.auditlogsService.getLogs(this.account['sub'], this.pageSize, filter)
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
    this.searchTextList.push(`text:${event.value}`);
    if (event.input) {
      event.input.value = '';
    }
    this.searchTextValues.push(`"${event.value}"`);
    this.getLogs();
  }

  removeSearchText(searchText: string) {
    const searchTextValue = searchText.replace('text:', '');
    const searchTextListIndex = this.searchTextList.indexOf(searchText);
    const searchTextValuesIndex =  this.searchTextValues.indexOf(`"${searchTextValue}"`);
    if (searchTextListIndex > -1) {
      this.searchTextList.splice(searchTextListIndex, 1);
    }
    if (searchTextValuesIndex > -1) {
      this.searchTextValues.splice(searchTextValuesIndex, 1);
    }
    this.getLogs();
  }
}
