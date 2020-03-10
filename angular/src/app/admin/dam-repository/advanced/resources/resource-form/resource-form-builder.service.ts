import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'ddap-common-lib';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../../shared/proto/dam-service';
import IViewRole = dam.v1.IViewRole;
import IViewPolicy = dam.v1.ViewRole.IViewPolicy;

@Injectable({
  providedIn: 'root',
})
export class ResourceFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(resource?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(resource, 'name'), [Validators.pattern(nameConstraintPattern)]],
      maxTokenTtl: [_get(resource, 'maxTokenTtl')],
      ui: this.formBuilder.group({
        label: [_get(resource, 'dto.ui.label'), [Validators.required]],
        description: [_get(resource, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
        access: [_get(resource, 'dto.ui.access')],
        owner: [_get(resource, 'dto.ui.owner')],
        size: [_get(resource, 'dto.ui.size')],
        year: [_get(resource, 'dto.ui.year')],
        tags: [_get(resource, 'dto.ui.tags')],
        applyUrl: [_get(resource, 'dto.ui.applyUrl'), [FormValidators.url]],
        troubleshootUrl: [_get(resource, 'dto.ui.troubleshootUrl'), [FormValidators.url]],
        imageUrl: [_get(resource, 'dto.ui.imageUrl'), [FormValidators.url]],
        infoUrl: [_get(resource, 'dto.ui.infoUrl'), [FormValidators.url]],
      }),
    });
  }

  buildViewForm(view?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(view, 'name'), [Validators.pattern(nameConstraintPattern)]],
      serviceTemplate: [_get(view, 'dto.serviceTemplate'), [Validators.required]],
      defaultRole: [_get(view, 'dto.defaultRole'), [Validators.required]],
      roles: this.buildRolesForm(_get(view, 'dto.roles')),
      contentTypes: [_get(view, 'dto.contentTypes')],
      labels: this.formBuilder.group({
        version: [_get(view, 'dto.labels.version'), [Validators.required]],
        topic: [_get(view, 'dto.labels.topic')],
        partition: [_get(view, 'dto.labels.partition')],
        fidelity: [_get(view, 'dto.labels.fidelity')],
        geoLocation: [_get(view, 'dto.labels.geoLocation')],
        aud: [_get(view, 'dto.labels.aud')],
      }),
      ui: this.formBuilder.group({
        label: [_get(view, 'dto.ui.label'), [Validators.required]],
        description: [_get(view, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
    });
  }

  buildRolesForm(roles?: { [k: string]: IViewRole }): FormGroup {
    const rolesForm = {};
    if (roles) {
      Object.entries(roles)
        .forEach(([roleKey, roleValue]) => {
          rolesForm[roleKey] = this.buildRoleForm(roleValue);
        });
    }
    return this.formBuilder.group(rolesForm);
  }

  buildRoleForm(role?: IViewRole): FormGroup {
    return this.formBuilder.group({
      policies: this.buildPoliciesForm(_get(role, 'policies')),
    });
  }

  buildPoliciesForm(policies?: IViewPolicy[]): FormArray {
    return this.formBuilder.array(policies && policies.length > 0
                                  ? policies.map((policy: IViewPolicy) => this.buildPolicyForm(policy))
                                  : []
    );
  }

  buildPolicyForm(policy?: IViewPolicy): FormGroup {
    return this.formBuilder.group({
      name: [_get(policy, 'name'), [Validators.required]],
      args: this.buildPolicyVariablesForm(_get(policy, 'args')),
    });
  }

  buildPolicyVariablesForm(variables?: { [k: string]: string }): FormGroup {
    const variablesForm = {};
    if (variables) {
      Object.entries(variables)
        .forEach(([variableKey, variableValue]) => {
          variablesForm[variableKey] = [variableValue, [Validators.required]];
        });
    }
    return this.formBuilder.group(variablesForm);
  }

}


