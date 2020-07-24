import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { switchMap, tap } from 'rxjs/operators';

import { tokens } from '../../../proto/dam-service';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'ddap-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss'],
})
export class SessionTableComponent implements OnInit {

  readonly displayedColumns: string[] = [
    'issuedAt', 'name', 'resources', 'issuer', 'scopes', 'expiresAt', 'client', 'moreActions',
  ];

  readonly #refreshTokens$ = new BehaviorSubject<ListTokensResponse>(undefined);

  tokens$: Observable<ListTokensResponse>;

  @Input()
  userId: string;

  constructor(private tokenService: SessionsService) {
  }

  ngOnInit() {
    this.tokens$ = this.#refreshTokens$.pipe(
      switchMap(() => this.tokenService.getTokens(this.userId)),
      // NOTE: 'resources' column is experimental feature
      // Hide 'resources' column if it is not provided in response
      tap((tokensResponse: ListTokensResponse) => {
        const hideResourcesColumn = tokensResponse.tokens.every((token) => !token.resources);
        if (hideResourcesColumn && this.displayedColumns.includes('resources')) {
          this.displayedColumns.splice(this.displayedColumns.indexOf('resources'), 1);
        }
      })
    );
  }

  revokeToken(tokenId: string) {
    this.tokenService.revokeToken(this.userId, tokenId)
      .subscribe(() => this.#refreshTokens$.next(undefined));
  }

  // Example of 'name' 'users/ic_ba090f2bb80c42bc9e73263b145/tokens/hydra:ZDlhYTA1MzYtYmRmYS00ZmZjLTg1MDctMjA1ZDk2MDY5MjIy'
  // where last part is 'id'
  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

  formatTime(timeString: string): string {
    if (!isNaN(parseInt(timeString, 10))) {
      return new Date(parseInt(timeString, 10) * 1000).toString();
    }
    return timeString;
  }

}
