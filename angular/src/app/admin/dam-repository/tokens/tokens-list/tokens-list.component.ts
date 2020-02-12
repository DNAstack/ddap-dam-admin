import { Component, OnInit } from '@angular/core';
import _get from 'lodash.get';
import _pick from 'lodash.pick';

import { TokensService } from '../tokens.service';

@Component({
  selector: 'ddap-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.scss'],
})
export class TokensListComponent implements OnInit {

  tokens: any[];
  constructor(private tokensService: TokensService) { }

  ngOnInit() {
    this.tokensService.getTokens().subscribe(({tokens}) => {
      this.tokens = tokens;
    });
  }

  revokeToken(token: any) {
    this.tokensService.revokeToken(token.name).subscribe();
  }

  getClientData(token: any) {
    return _get(token, 'client');
  }

  getTokenData(token: any) {
    return _pick(token, ['aud', 'exp', 'iat', 'scope', 'target']);
  }
}
