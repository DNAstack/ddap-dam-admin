import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  displayName: string;
  userId: string;

  private readonly refreshConsents$ = new BehaviorSubject<ListConsentsResponse>(undefined);

  constructor( private consentsService: ConsentsService,
               private userService: UserService,
               private route: ActivatedRoute) {
    dayjs.extend(utc);
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.entityId;
    const { displayName } = this.route.snapshot.queryParams;
    this.displayName = displayName;
    if (!this.userId || !this.userId.length) {
      this.userService.getLoggedInUser().subscribe(user => {
        this.userId = user.id;
        this.getConsents();
      });
    } else {
      this.getConsents();
    }
  }

  getConsents() {
    this.consents$ = this.refreshConsents$.pipe(
      switchMap(() => this.consentsService.getConsents(this.userId, { pageSize: 20 }))
    );
  }

  revokeConsent(consentId: string): void {
    this.consentsService.revokeConsent(this.userId, consentId)
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

  getDisplayName() {
    return this.displayName ? `Consents of ${this.displayName}` : 'Consents';
  }
}
