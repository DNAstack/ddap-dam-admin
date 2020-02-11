import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { WhitelistsService } from '../whitelists.service';

@Component({
  selector: 'ddap-whitelist-list',
  templateUrl: './whitelist-list.component.html',
  styleUrls: ['./whitelist-list.component.scss'],
})
export class WhitelistListComponent implements OnInit {

  whitelists$: Observable<any[]>;

  private readonly refreshWhitelists$ = new BehaviorSubject<any>([]);

  constructor(private route: ActivatedRoute,
              private whitelistsService: WhitelistsService) {
  }

  ngOnInit() {
    this.whitelists$ = this.refreshWhitelists$.pipe(
      switchMap(() => this.whitelistsService.list())
    );
  }

  deleteWhitelist(whitelistId: string): void {
    this.whitelistsService.remove(whitelistId)
      .subscribe(() => this.refreshWhitelists$.next({}));
  }

}
