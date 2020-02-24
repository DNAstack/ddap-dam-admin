import { Component, OnInit } from '@angular/core';
import _get from 'lodash.get';
import _pick from 'lodash.pick';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TokensService } from '../tokens.service';

@Component({
  selector: 'ddap-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.scss'],
})
export class TokensListComponent implements OnInit {

  tokens$: Observable<any[]>;
  private readonly refreshTokens$ = new BehaviorSubject(undefined);
  constructor(private tokensService: TokensService) { }

  ngOnInit() {
    this.tokens$ = this.refreshTokens$.pipe(
      switchMap(() => this.tokensService.getTokens())
    );
  }

  revokeToken(token: any) {
    this.tokensService.revokeToken(token.name).subscribe(() => this.refreshTokens$.next(undefined));
  }

  getClientData(token: any) {
    return _get(token, 'client');
  }

  getTokenData(token: any) {
    return _pick(token, ['aud', 'exp', 'iat', 'scope', 'target']);
  }
}
