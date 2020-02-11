import { Component, OnInit } from '@angular/core';

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
    this.tokensService.getTokens().subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  revokeToken(tokenId: string) {
    this.tokensService.revokeToken(tokenId).subscribe();
  }

}
