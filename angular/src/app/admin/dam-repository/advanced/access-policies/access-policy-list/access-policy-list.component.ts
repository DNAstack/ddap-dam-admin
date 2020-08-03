import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';
import { flatMap, tap } from 'rxjs/operators';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessPolicyService } from '../access-policies.service';
import { AccessPoliciesStore } from '../access-policies.store';

@Component({
  selector: 'ddap-access-policy-list',
  templateUrl: './access-policy-list.component.html',
  styleUrls: ['./access-policy-list.component.scss'],
})
export class AccessPolicyListComponent
  extends DamConfigEntityListComponentBaseDirective<AccessPoliciesStore>
  implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'variableDefinitions', 'conditions', 'infoUrl', 'moreActions'];

  constructor(
    protected route: ActivatedRoute,
    protected damConfigStore: DamConfigStore,
    protected accessPoliciesStore: AccessPoliciesStore,
    protected dialog: MatDialog,
    private accessPolicyService: AccessPolicyService
  ) {
    super(route, damConfigStore, accessPoliciesStore, dialog);
  }

  isBuiltInPolicy(policy: EntityModel): boolean {
    return _get(policy, 'dto.ui.source') === 'built-in';
  }

  protected delete(id: string): void {
    this.accessPolicyService.remove(id)
      .pipe(
        tap(() => this.damConfigStore.set())
      )
      .subscribe();
  }

}
