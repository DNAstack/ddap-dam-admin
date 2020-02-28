import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

import { common } from '../../../../../shared/proto/dam-service';
import { TokensService } from '../tokens.service';

import ITokenMetadata = common.ITokenMetadata;

@Component({
  selector: 'ddap-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.scss'],
})
export class TokensListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'scopes', 'expiresAt', 'issuedAt', 'client', 'moreActions'];

  tokens$: Observable<ITokenMetadata[]>;

  private readonly refreshTokens$ = new BehaviorSubject(undefined);

  constructor(private tokensService: TokensService) {
  }

  ngOnInit() {
    this.tokens$ = this.refreshTokens$.pipe(
      switchMap(() => this.tokensService.getTokens()
        .pipe(
          pluck('tokens')
        )
      )
    );
  }

  revokeToken(tokenId: string) {
    this.tokensService.revokeToken(tokenId)
      .subscribe(() => this.refreshTokens$.next(undefined));
  }

}
