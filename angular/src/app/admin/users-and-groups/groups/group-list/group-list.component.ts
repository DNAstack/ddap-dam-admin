import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import IListGroupsResponse = scim.v2.IListGroupsResponse;
import { DeleteActionConfirmationDialogComponent, PaginationType } from 'ddap-common-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { scim } from '../../../../shared/proto/dam-service';
import { GroupService } from '../group.service';

@Component({
  selector: 'ddap-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {

  readonly displayedColumns: string[] = ['name', 'id', 'moreActions'];
  readonly PaginationType = PaginationType;

  groups$: Observable<IListGroupsResponse>;

  private readonly defaultPageSize = 25;
  private readonly refreshGroups$ = new BehaviorSubject<any>({ startIndex: 1, count: this.defaultPageSize });

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.groups$ = this.refreshGroups$.pipe(
      switchMap((params) => this.groupService.getGroups(params))
    );
  }

  changePage(page: PageEvent) {
    const params = this.refreshGroups$.getValue();
    if (page.pageIndex || page.previousPageIndex) {
      params.startIndex = this.getStartIndexBasedOnPageChangeDirection(page, params.count, params.startIndex);
    }
    if (page.pageSize) {
      params.count = page.pageSize;
    }
    this.refreshGroups$.next(params);
  }

  openDeleteConfirmationDialog(groupId: string, groupName: string) {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: groupName,
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.deleteGroup(groupId);
        }
      });
  }

  private deleteGroup(groupId: string): void {
    this.groupService.deleteGroup(groupId)
      .subscribe(() => this.refreshGroups$.next({}));
  }

  private getStartIndexBasedOnPageChangeDirection(page: PageEvent, previousPageSize: number, previousStartIndex: number): number {
    const { previousPageIndex, pageIndex, pageSize } = page;
    // if page size has changed -> reset start index
    if (previousPageSize !== pageSize) {
      return 1;
    }
    if (previousPageIndex > pageIndex) {
      return previousStartIndex - pageSize;
    }
    if (previousPageIndex < pageIndex) {
      return previousStartIndex + pageSize;
    }
  }

}
