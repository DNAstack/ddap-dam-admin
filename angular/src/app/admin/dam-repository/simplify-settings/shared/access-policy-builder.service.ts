import { Injectable } from '@angular/core';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import { EMPTY, Observable, of } from 'rxjs';

import { dam } from '../../../../shared/proto/dam-service';
import { AccessPolicyService } from '../../resource-settings/access-policies/access-policies.service';
import { AccessPoliciesStore } from '../../resource-settings/access-policies/access-policies.store';

import { AccessPolicyType } from './access-policy-type.enum';
import Policy = dam.v1.Policy;

export const controlAccessGrantsPolicyId = 'control-access-grants-template';
export const researcherStatusPolicyId = 'researcher-status-template';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyBuilderService {

  constructor(private accessPolicyService: AccessPolicyService,
              private accessPoliciesStore: AccessPoliciesStore) {
  }

  createReusableAccessPolicy(type: AccessPolicyType): Observable<any> {
    const accessPolicy: EntityModel = type === AccessPolicyType.controlAccessGrants
                                      ? this.buildAccessPolicyTemplate(
        controlAccessGrantsPolicyId, 'Control Access Grants Template', 'ControlledAccessGrants'
      )
                                      : this.buildAccessPolicyTemplate(
        researcherStatusPolicyId, 'Researcher Status Template', 'ResearcherStatus'
      );
    return this.saveAccessPolicy(accessPolicy);
  }

  private saveAccessPolicy(accessPolicy: EntityModel): Observable<any> {
    const existsAccessPolicy = this.accessPoliciesStore.state.has(accessPolicy.name);
    if (!existsAccessPolicy) {
      return this.accessPolicyService.save(accessPolicy.name, new ConfigModificationModel(accessPolicy.dto, {}));
    } else {
      return of({});
    }
  }

  private buildAccessPolicyTemplate(id: string, label: string, type: string): EntityModel {
    const accessPolicy = Policy.create({
      ui: {
        label,
        description: `Template for automatic generation of policies during simplified access creation`,
      },
      variableDefinitions: {
        URL: {
          regexp: '^(http:\\/\\/|https:\\/\\/){1}.*',
          ui: {
            description: 'URL value',
          },
        },
      },
      anyOf: [
        {
          allOf: [
            {
              type,
              value: 'split_pattern:${URL}',
            },
          ],
        },
      ],
    });

    return new EntityModel(id, accessPolicy);
  }

}
