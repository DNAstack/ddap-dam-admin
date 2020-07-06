import { Component, OnInit } from '@angular/core';
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
    'name', 'resources', 'subject', 'issuer', 'scopes', 'issuedAt', 'client', 'moreActions',
  ];

  tokens$: Observable<ListTokensResponse>;

  private readonly refreshTokens$ = new BehaviorSubject<ListTokensResponse>(undefined);

  constructor(
    private tokenService: TokensService,
    private identityService: IdentityService
  ) {
  }

  ngOnInit() {
    this.tokens$ = this.identityService.getIdentity()
      .pipe(
        flatMap((identity: Identity) => {
          return this.refreshTokens$.pipe(
            switchMap(() => this.tokenService.getTokens(identity.account.sub)),
            // NOTE: 'resources' column is experimental feature
            // Hide 'resources' column if it is not provided in response
            tap((tokensResponse: ListTokensResponse) => {
              const hideResourcesColumn = tokensResponse.tokens.every((token) => !token.resources);
              if (hideResourcesColumn) {
                this.displayedColumns.splice(this.displayedColumns.indexOf('resources'), 1);
              }
            })
          );
        })
      );
  }

  revokeToken(tokenId: string) {
    this.identityService.getIdentity()
      .pipe(
        flatMap((identity: Identity) => this.tokenService.revokeToken(identity.account.sub, tokenId))
      )
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

}
