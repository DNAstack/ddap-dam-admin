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
                 serviceTemplate: string,
                 variables: object,
                 accessLevel: AccessLevel,
                 accessPolicyId: string,
                 accessPolicyValue: string,
                 aud: string): Observable<any> {
    const resourceModel: EntityModel = this.buildResource(
      id, serviceTemplate, variables, accessLevel, accessPolicyId, accessPolicyValue, aud
    );
    const resource = new ConfigModificationModel(resourceModel.dto, {});
    return this.resourceService.save(resourceModel.name, resource);
  }

  private buildResource(id: string,
                        serviceTemplate: string,
                        variables: object,
                        accessLevel: AccessLevel,
                        accessPolicyId: string,
                        accessPolicyValue: string,
                        aud: string): EntityModel {
    const viewId = `view-${id}`;
    const roleId = getRoleName(accessLevel, serviceTemplate);
    const accessPolicy = {
      ui: {
        label: id,
        description: `Automatically generated resource for collection [${id}]`,
      },
      views: {
        [viewId]: {
          ui: {
            label: viewId,
            description: `Automatically generated view for collection [${id}]`,
          },
          items: [
            {
              args: {...variables},
            },
          ],
          version: id,
          serviceTemplate,
          defaultRole: roleId,
          roles: {
            [roleId]: this.buildAccessRole(accessPolicyId, accessPolicyValue),
          },
          aud,
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
