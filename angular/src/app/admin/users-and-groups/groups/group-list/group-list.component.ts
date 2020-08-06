import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GroupsService } from '../groups.service';

@Component({
  selector: 'ddap-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'users', 'moreActions'];

  whitelists$: Observable<any[]>;

  private readonly refreshWhitelists$ = new BehaviorSubject<any>([]);

  constructor(private route: ActivatedRoute,
              private whitelistsService: GroupsService) {
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
