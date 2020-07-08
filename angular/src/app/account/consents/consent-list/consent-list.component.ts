import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import ListConsentsResponse = consents.v1.ListConsentsResponse;
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, switchMap } from 'rxjs/operators';

import { consents } from '../../../shared/proto/dam-service';
import { UserService } from '../../../shared/users/user.service';
import { ConsentsService } from '../consents.service';

@Component({
  selector: 'ddap-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.scss'],
})
export class ConsentListComponent implements OnInit {

  readonly displayedColumns: string[] = ['name', 'client', 'scopes', 'visas', 'createdAt', 'expiresAt', 'moreActions'];
  readonly dayjs: Function = dayjs;

  consents$: Observable<ListConsentsResponse>;

  private readonly refreshConsents$ = new BehaviorSubject<ListConsentsResponse>(undefined);

  constructor( private consentsService: ConsentsService,
               private userService: UserService) {
    dayjs.extend(utc);
  }

  ngOnInit() {
    this.consents$ = this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => {
          return this.refreshConsents$.pipe(
            switchMap(() => this.consentsService.getConsents(user.id, { pageSize: 20 }))
          );
        })
      );
  }

  revokeConsent(consentId: string): void {
    this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => this.consentsService.revokeConsent(user.id, consentId))
      )
      .subscribe(() => this.refreshConsents$.next(undefined));
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
