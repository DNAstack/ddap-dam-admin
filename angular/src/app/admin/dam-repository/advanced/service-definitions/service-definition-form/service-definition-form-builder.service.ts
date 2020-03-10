import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

import { dam } from '../../../../../shared/proto/dam-service';
import { ConditionFormBuilder } from '../../../shared/condition-form/condition-form-builder.service';
import IVariableFormat = dam.v1.IVariableFormat;
import IServiceRole = dam.v1.IServiceRole;
import { PassportVisaValidators } from '../../../shared/passport-visa/passport-visa-validators';

@Injectable({
  providedIn: 'root',
})
export class ServiceDefinitionFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(serviceDefinition?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(serviceDefinition, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(serviceDefinition, 'dto.ui.label'), [Validators.required]],
        description: [_get(serviceDefinition, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      targetAdapter: [_get(serviceDefinition, 'dto.serviceName'), [Validators.required]],
      interfaces: this.buildInterfacesForm(_get(serviceDefinition, 'dto.interfaces')),
      roles: this.buildServiceRolesForm(_get(serviceDefinition, 'dto.roles')),
    });
  }

  buildInterfacesForm(interfaces?: { [k: string]: string }): FormGroup {
    const interfacesForm = {};
    if (interfaces) {
      Object.entries(interfaces)
        .forEach(([interfaceKey, interfaceValue]) => {
          interfacesForm[interfaceKey] = this.buildInterfaceForm(interfaceKey, interfaceValue);
        });
    }
    return this.formBuilder.group(interfacesForm);
  }

  buildInterfaceForm(interfaceId: string, interfaceValue?: string): FormGroup {
    return this.formBuilder.group({
      id: [interfaceId, [Validators.required]],
      value: [interfaceValue, [Validators.required]],
    });
  }

  buildServiceRolesForm(serviceRoles?: { [k: string]: IServiceRole }): FormGroup {
    const serviceRolesForm = {};
    if (serviceRoles) {
      Object.entries(serviceRoles)
        .forEach(([serviceRoleKey, serviceRole]) => {
          serviceRolesForm[serviceRoleKey] = this.buildServiceRoleForm(serviceRoleKey, serviceRole);
        });
    }
    return this.formBuilder.group(serviceRolesForm);
  }

  buildServiceRoleForm(serviceRoleId: string, serviceRole?: IServiceRole): FormGroup {
    return this.formBuilder.group({
      id: [serviceRoleId, [Validators.required]],
      targetRoles: [_get(serviceRole, 'targetRoles', [])],
      targetScopes: [_get(serviceRole, 'targetScopes', [])],
      damRoleCategories: [_get(serviceRole, 'damRoleCategories', [])],
      ui: this.formBuilder.group({
        label: [_get(serviceRole, 'ui.label'), [Validators.required]],
        description: [_get(serviceRole, 'ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
    });
  }

}


