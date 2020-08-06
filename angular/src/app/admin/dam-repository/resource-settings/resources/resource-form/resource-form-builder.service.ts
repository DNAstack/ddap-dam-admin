import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'ddap-common-lib';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../../shared/proto/dam-service';
import IViewRole = dam.v1.IViewRole;
import IViewPolicy = dam.v1.ViewRole.IViewPolicy;
import IView = dam.v1.IView;
import IItem = dam.v1.View.IItem;
import { AccessPoliciesStore } from '../../access-policies/access-policies.store';

@Injectable({
  providedIn: 'root',
})
export class ResourceFormBuilder {
  policies: EntityModel[];

  constructor(private formBuilder: FormBuilder,
              private accessPoliciesStore: AccessPoliciesStore) {
    this.accessPoliciesStore.getAsList()
      .subscribe((policies) => {
        this.policies = policies;
      });
  }

  buildForm(resource?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(resource, 'name'), [Validators.pattern(nameConstraintPattern)]],
      maxTokenTtl: [_get(resource, 'dto.maxTokenTtl')],
      views: this.buildViewsForm(_get(resource, 'dto.views')),
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

  buildViewsForm(views?: IView[]): FormGroup {
    const viewsForm = {};
    if (views) {
      Object.entries(views)
        .forEach(([viewKey, viewValue]) => {
          viewsForm[viewKey] = this.buildViewForm(viewKey, viewValue);
        });
    }
    return this.formBuilder.group(viewsForm);
  }

  buildViewForm(viewId?: string, view?: IView): FormGroup {
    return this.formBuilder.group({
      id: [viewId, [Validators.pattern(nameConstraintPattern)]],
      serviceTemplate: [_get(view, 'serviceTemplate'), [Validators.required]],
      defaultRole: [_get(view, 'defaultRole'), [Validators.required]],
      roles: this.buildRolesForm(_get(view, 'roles')),
      contentTypes: [_get(view, 'contentTypes')],
      items: this.buildItemsForm(_get(view, 'items')),
      labels: this.formBuilder.group({
        version: [_get(view, 'labels.version'), [Validators.required]],
        topic: [_get(view, 'labels.topic')],
        partition: [_get(view, 'labels.partition')],
        fidelity: [_get(view, 'labels.fidelity')],
        geoLocation: [_get(view, 'labels.geoLocation')],
      }),
      ui: this.formBuilder.group({
        label: [_get(view, 'ui.label'), [Validators.required]],
        description: [_get(view, 'ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
    });
  }

  buildRolesForm(roles?: { [key: string]: IViewRole }): FormGroup {
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
      args: this.buildPolicyVariablesForm(policy),
    });
  }

  buildVariablesForm(variables?: { [key: string]: string }, validators?: any[]): FormGroup {
    const variablesForm = {};
    if (variables) {
      Object.entries(variables)
        .forEach(([variableKey, variableValue]) => {
          // special case for 'paths' -> turn to string array
          if (variableKey === 'paths' && variableValue) {
            variablesForm[variableKey] = [variableValue.split(';'), validators];
          } else {
            variablesForm[variableKey] = [variableValue, validators];
          }
        });
    }
    return this.formBuilder.group(variablesForm);
  }

  buildPolicyVariablesForm(selectedPolicy?: IViewPolicy): FormGroup {
    const variablesForm = {};
    if (selectedPolicy) {
      const policyDef = this.policies.find(policy => policy.name === selectedPolicy.name);
      const variables = _get(selectedPolicy, 'args', {});
      const { variableDefinitions } = policyDef.dto;
      Object.entries(variables)
        .forEach(([variableKey, variableValue]) => {
          const validators = [];
          if (variableDefinitions[variableKey]['regexp']) {
            validators.push(Validators.pattern(variableDefinitions[variableKey]['regexp']));
          }
          if (!variableDefinitions[variableKey]['optional']) {
            validators.push(Validators.required);
          }
          variablesForm[variableKey] = [variableValue, validators];
        });
    }
    return this.formBuilder.group(variablesForm);
  }

  buildItemsForm(items?: IItem[]): FormArray {
    return this.formBuilder.array(items && items.length > 0
                                  ? items.map((item: IItem) => this.buildItemForm(item))
                                  : []
    );
  }

  buildItemForm(item?: IItem): FormGroup {
    return this.formBuilder.group({
      args: this.buildVariablesForm(_get(item, 'args')),
    });
  }

}


