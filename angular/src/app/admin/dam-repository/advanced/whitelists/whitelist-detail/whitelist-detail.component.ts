import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';

import { WhitelistsService } from '../whitelists.service';

@Component({
  selector: 'ddap-whitelist-detail',
  templateUrl: './whitelist-detail.component.html',
  styleUrls: ['./whitelist-detail.component.scss'],
})
export class WhitelistDetailComponent implements OnInit {

  whitelist$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private whitelistsService: WhitelistsService) {
  }

  ngOnInit(): void {
    this.whitelist$ = this.route.params.pipe(
      switchMap((params) => {
        const { entityId } = params;
        return this.whitelistsService.get(entityId);
      }),
      share()
    );
  }

}
