import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import ListConsentsResponse = consents.v1.ListConsentsResponse;
import { consents } from '../../../proto/dam-service';
import { ConsentsService } from '../consents.service';

@Component({
  selector: 'ddap-consent-table',
  templateUrl: './consent-table.component.html',
  styleUrls: ['./consent-table.component.scss'],
})
export class ConsentTableComponent implements OnInit {

  readonly displayedColumns: string[] = ['name', 'client', 'scopes', 'visas', 'createdAt', 'expiresAt', 'moreActions'];
  readonly dayjs: Function = dayjs;

  readonly #refreshConsents$ = new BehaviorSubject<ListConsentsResponse>(undefined);

  consents$: Observable<ListConsentsResponse>;

  @Input()
  userId: string;

  constructor(private consentsService: ConsentsService) {
    dayjs.extend(utc);
  }

  ngOnInit() {
    this.consents$ = this.#refreshConsents$.pipe(
      switchMap(() => this.consentsService.getConsents(this.userId, { pageSize: 20 }))
    );
  }

  revokeConsent(consentId: string): void {
    this.consentsService.revokeConsent(this.userId, consentId)
      .subscribe(() => this.#refreshConsents$.next(undefined));
  }

  // Example of 'name' 'users/ic_ba090f2bb80c42bc9e73263b145/consents/770c138d-c18d-43eb-b826-624196de6acf' where last
  // part is 'id'
  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

}
