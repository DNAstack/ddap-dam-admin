import { ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationType } from 'ddap-common-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IdentityStore } from '../../../../account/identity/identity.store';
import { AuditlogDetailStateService } from '../auditlog-detail-state.service';
import { AuditlogResponseModel } from '../auditlog.model';
import { AuditlogsService } from '../auditlogs.service';
import { Decision } from '../decision.enum';
import { LogTypes } from '../log-type.enum';

@Component({
  selector: 'ddap-auditlog-table',
  templateUrl: './auditlog-table.component.html',
  styleUrls: ['./auditlog-table.component.scss'],
})
export class AuditlogTableComponent implements OnInit {

  readonly columnsToDisplay: string[] = ['auditlogId', 'type', 'time', 'decision', 'resourceName'];
  readonly separatorCodes: number[] = [ENTER];
  readonly logTypeFilter: FormControl = new FormControl(LogTypes.all);
  readonly searchTextList: FormControl = new FormControl([]);
  readonly decisionFilter: FormControl = new FormControl(Decision.all);
  readonly LogTypes = LogTypes;
  readonly Decision = Decision;
  readonly PaginationType = PaginationType;

  auditLogs$: Observable<AuditlogResponseModel>;
  account;
  searchTextValues: string[] = [];
  disableSearchText: boolean;
  pageSize: number;
  nextPageToken: string;

  @Input()
  userId: string;

  private readonly defaultPageSize = 25;
  private readonly refreshLogs$ = new BehaviorSubject<any>({ pageSize: this.defaultPageSize });

  constructor(
    private auditlogsService: AuditlogsService,
    private auditlogDetailStateService: AuditlogDetailStateService,
    private identityStore: IdentityStore,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams.pageSize) {
      this.pageSize = queryParams.pageSize;
    }

    this.updateActiveFilterControls(decodeURIComponent(queryParams.filter));
    this.auditLogs$ = this.refreshLogs$.pipe(
      switchMap((params) => {
        return this.auditlogsService.getLogs(this.userId, params.filter, params.pageSize || this.defaultPageSize, params.nextPageToken);
      }),
      tap((response) => {
        this.nextPageToken = response.nextPageToken;
        response.auditLogs?.forEach((auditLog) => this.generateIdForLog(auditLog));
      })
    );
    this.refreshLogs$.next({...queryParams});
  }

  refreshLogs() {
    const activeFilters = this.getFilters();
    const params = this.refreshLogs$.getValue();
    params.filter = encodeURIComponent(activeFilters);
    this.refreshLogs$.next(params);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { ...params },
        queryParamsHandling: 'merge',
      }
    );
  }

  changePage(page: PageEvent | any) {
    const params = this.refreshLogs$.getValue();
    if (page.nextPage) {
      params.nextPageToken = this.nextPageToken;
    }
    if (page.pageSize) {
      this.pageSize = params.pageSize = page.pageSize;
    }
    this.refreshLogs$.next(params);

    const { pageSize, filter } = params;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { pageSize, filter },
        queryParamsHandling: 'merge',
      }
    );
  }

  getFilters(): string {
    let filter = '';
    if (this.logTypeFilter.value.length) {
      filter = `type="${this.logTypeFilter.value}"`;
    }
    if (this.searchTextValues.length > 0) {
      if (filter.length > 0) {
        filter = filter + ` AND text:${this.searchTextValues.join(' OR ')}`;
      } else {
        filter = `text:${this.searchTextValues.join(' OR ')}`;
      }
    }
    if (this.decisionFilter.value.length > 0) {
      if (filter.length > 0) {
        filter = filter + ` AND decision="${this.decisionFilter.value}"`;
      } else {
        filter = `decision="${this.decisionFilter.value}"`;
      }
    }
    return filter;
  }

  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

  gotoAuditlogDetail(log) {
    this.auditlogDetailStateService.saveAuditLog(log);
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
    this.refreshLogs();
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
    this.refreshLogs();
  }

  formatTime(timeString: string): Date {
    return new Date(timeString);
  }

  private updateActiveFilterControls(filters: string) {
    if (!filters) {
      return;
    }
    filters.split('AND').map(filter => {
      if (filter.indexOf('type=') !== -1) {
        this.logTypeFilter.patchValue(filter.replace('type=', '')
          .replace(/\s|["]/g, ''));
        this.logTypeFilter.updateValueAndValidity();
      }
      if (filter.trim().indexOf('text:') !== -1) {
        this.searchTextList.value.push(filter.replace(/\s|["]/g, ''));
        this.searchTextList.updateValueAndValidity();
        this.searchTextValues.push(filter.trim().replace('text:', ''));
        this.disableSearchText = true;
      }
      if (filter.indexOf('decision=') !== -1) {
        this.decisionFilter.patchValue(filter.replace('decision=', '')
          .replace(/\s|["]/g, ''));
        this.decisionFilter.updateValueAndValidity();
      }
    });
  }

  private generateIdForLog(log: any): void {
    log.auditlogId = this.getIdFromName(log['name']);
  }

}
