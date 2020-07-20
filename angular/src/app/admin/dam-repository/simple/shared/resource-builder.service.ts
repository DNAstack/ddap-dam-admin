import { Injectable } from '@angular/core';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { dam } from '../../../../shared/proto/dam-service';
import { ResourceService } from '../../advanced/resources/resources.service';

import { getRoleName } from './access-level-role.mapper';
import { AccessLevel } from './access-level.enum';
import { controlAccessGrantsPolicyId, researcherStatusPolicyId } from './access-policy-builder.service';
import { AccessPolicyType } from './access-policy-type.enum';
import IViewRole = dam.v1.IViewRole;
import ViewRole = dam.v1.ViewRole;

@Injectable({
  providedIn: 'root',
})
export class ResourceBuilderService {

  constructor(private resourceService: ResourceService) {
  }

  createResource(id: string,
                 displayName: string,
                 serviceTemplate: string,
                 variables: object,
                 accessLevel: AccessLevel,
                 accessPolicyId: string,
                 accessPolicyValue: string): Observable<any> {
    const resourceModel: EntityModel = this.buildResource(
      id, displayName, serviceTemplate, variables, accessLevel, accessPolicyId, accessPolicyValue
    );
    const resource = new ConfigModificationModel(resourceModel.dto, {});
    return this.resourceService.save(resourceModel.name, resource);
  }

  private buildResource(
    id: string,
    displayName: string,
    serviceTemplate: string,
    variables: object,
    accessLevel: AccessLevel,
    accessPolicyId: string,
    accessPolicyValue: string
  ): EntityModel {
    const viewId = `view-${id}`;
    const roleId = getRoleName(accessLevel, serviceTemplate);
    const accessPolicy = {
      ui: {
        label: displayName,
        description: `Automatically generated resource from Quickstart`,
      },
      views: {
        [viewId]: {
          ui: {
            label: `View for ${displayName}`,
            description: `Automatically generated view from Quickstart`,
          },
          items: [
            {
              args: {...variables},
            },
          ],
          labels: {
            version: id,
          },
          serviceTemplate,
          defaultRole: roleId,
          roles: {
            [roleId]: this.buildAccessRole(accessPolicyId, accessPolicyValue),
          },
        },
      },
    };

    return new EntityModel(id, accessPolicy);
  }

  private buildAccessRole(accessPolicyId: string, accessPolicyValue: string): IViewRole {
    return ViewRole.create({
      policies: [
        {
          name: accessPolicyId === AccessPolicyType.controlAccessGrants
                ? controlAccessGrantsPolicyId
                : researcherStatusPolicyId,
          args: {
            URL: accessPolicyValue,
          },
        },
      ],
    });
  }

}
