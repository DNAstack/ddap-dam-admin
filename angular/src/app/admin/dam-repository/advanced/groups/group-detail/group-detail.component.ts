import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';

import { GroupsService } from '../groups.service';

@Component({
  selector: 'ddap-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {

  whitelist$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private whitelistsService: GroupsService) {
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
