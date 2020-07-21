import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';

import { DamConfigEntityListComponentBaseDirective } from '../../../shared/dam/dam-config-entity-list-component-base.directive';
import { DamConfigStore } from '../../../shared/dam/dam-config.store';
import { AccessPoliciesStore } from '../access-policies.store';

@Component({
  selector: 'ddap-access-policy-list',
  templateUrl: './access-policy-list.component.html',
  styleUrls: ['./access-policy-list.component.scss'],
})
export class AccessPolicyListComponent extends DamConfigEntityListComponentBaseDirective<AccessPoliciesStore> implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'variableDefinitions', 'conditions', 'infoUrl', 'moreActions'];

  constructor(protected route: ActivatedRoute,
              protected damConfigStore: DamConfigStore,
              protected accessPoliciesStore: AccessPoliciesStore) {
    super(route, damConfigStore, accessPoliciesStore);
  }

  isBuiltInPolicy(policy: EntityModel): boolean {
    return _get(policy, 'dto.ui.source') === 'built-in';
  }

}
