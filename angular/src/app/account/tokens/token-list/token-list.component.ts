import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, switchMap, tap } from 'rxjs/operators';

import { tokens } from '../../../shared/proto/dam-service';
import { Identity } from '../../identity/identity.model';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { IdentityService } from '../../identity/identity.service';
import { TokensService } from '../tokens.service';

@Component({
  selector: 'ddap-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnInit {

  displayedColumns: string[] = [
    'issuedAt', 'name', 'resources', 'issuer', 'scopes', 'client', 'moreActions',
  ];

  tokens$: Observable<ListTokensResponse>;
  subject: string;
  userId: string;
  displayName: string;

  private readonly refreshTokens$ = new BehaviorSubject<ListTokensResponse>(undefined);

  constructor(
    private tokenService: TokensService,
    private identityService: IdentityService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.entityId;
    const { displayName } = this.route.snapshot.queryParams;
    this.displayName = displayName;
    if (!this.userId || !this.userId.length) {
      this.identityService.getIdentity().subscribe((identity: Identity) => {
        this.userId = identity.account.sub;
        this.getTokens();
      });
    } else {
      this.getTokens();
    }
  }

  getTokens() {
    this.tokens$ = this.refreshTokens$.pipe(
      switchMap(() => this.tokenService.getTokens(this.userId)),
      // NOTE: 'resources' column is experimental feature
      // Hide 'resources' column if it is not provided in response
      tap((tokensResponse: ListTokensResponse) => {
        const hideResourcesColumn = tokensResponse.tokens.every((token) => !token.resources);
        this.subject = tokensResponse.tokens.length ? tokensResponse.tokens[0]['sub'] : '';
        if (hideResourcesColumn && this.displayedColumns.includes('resources')) {
          this.displayedColumns.splice(this.displayedColumns.indexOf('resources'), 1);
        }
      })
    );
  }

  revokeToken(tokenId: string) {
    this.tokenService.revokeToken(this.userId, tokenId)
      .subscribe(() => this.refreshTokens$.next(undefined));
  }

  // Example of 'name' 'users/ic_ba090f2bb80c42bc9e73263b145/tokens/hydra:ZDlhYTA1MzYtYmRmYS00ZmZjLTg1MDctMjA1ZDk2MDY5MjIy'
  // where last part is 'id'
  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

  formatTime(timeString: string) {
    if (!isNaN(parseInt(timeString, 10))) {
      return new Date(parseInt(timeString, 10) * 1000).toString();
    }
    return timeString;
  }

  getDisplayName() {
    return this.displayName ? `Sessions of ${this.displayName}` : 'Sessions';
  }

}
