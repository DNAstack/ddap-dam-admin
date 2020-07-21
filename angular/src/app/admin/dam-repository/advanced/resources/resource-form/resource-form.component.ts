import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Form } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { dam } from '../../../../../shared/proto/dam-service';
import { generateInternalName } from '../../../shared/internal-name.util';

import { ResourceFormBuilder } from './resource-form-builder.service';
import { ResourceViewFormComponent } from './resource-view-form/resource-view-form.component';

import Resource = dam.v1.Resource;

@Component({
  selector: 'ddap-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss'],
  entryComponents: [ResourceViewFormComponent],
})
export class ResourceFormComponent implements OnInit, OnDestroy, Form {

  get views(): FormGroup {
    return this.form.get('views') as FormGroup;
  }

  @Input()
  internalNameEditable = false;
  @Input()
  resource?: EntityModel = new EntityModel('', Resource.create());
  @Output()
  readonly formChange: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  subscriptions: Subscription[] = [];
  viewIndex = 99;

  constructor(private formBuilder: FormBuilder,
              private resourceFormBuilder: ResourceFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.resourceFormBuilder.buildForm(this.resource);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
    this.subscriptions.push(this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.formChange.emit())
      )
      .subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  isValid() {
    return this.form.valid;
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  addView() {
    const _id = `aaa_${this.viewIndex--}`; // To make sure that new view is a first view
    this.views.addControl(_id, this.resourceFormBuilder.buildViewForm());
  }

  removeView(viewId?: string) {
    this.views.removeControl(viewId);
  }

  getModel(): EntityModel {
    const { id, views, ...rest } = this.form.value;
    const resource = {
      views: this.getViewsModel(views),
      ...rest,
    };

    return new EntityModel(id, resource);
  }

  translateRealViewNamesToAssignedNames(): { [key: string]: string } {
    const { views } = this.form.value;
    const realNameAssignedNameMap = {};
    if (views) {
      Object.entries(views)
        .forEach(([assignedId, view]: any) => {
          const { id } = view;
          realNameAssignedNameMap[!id ? assignedId : id] = assignedId;
        });
    }
    return realNameAssignedNameMap;
  }

  isAnyOfControlsInvalid(paths: string[]): boolean {
    return paths.some((path) => !this.form.get(path) || this.form.get(path).invalid);
  }

  private getViewsModel(views): object {
    const alteredViews = {};
    if (views) {
      Object.entries(views)
        .forEach(([oldViewId, view]: any) => {
          const { id, items, roles, ...rest } = view;
          // Use automatically generated ID only if there is none provided by user
          alteredViews[!id ? oldViewId : id] = {
            items: this.sanitizeItems(items),
            roles: this.sanitizeRoles(roles),
            ...rest,
          };
        });
    }
    return alteredViews;
  }

  private sanitizeItems(items: any[]): any[] {
    if (!items || items.length < 1) {
      return [];
    }

    // We need to join array argument to single string separated by semicolon
    items.forEach((item) => {
      Object.entries(item.args)
        .filter(([_, value]: any) => Array.isArray(value))
        .forEach(([argKey, argValue]: any) => {
          item.args[argKey] = argValue.join(';');
        });
    });

    return items;
  }

  private sanitizeRoles(roles) {
    if (!roles) {
      return {};
    }

    // We need to remove empty roles
    const emptyRoles = Object.entries(roles)
      .filter(([_, value]: any) => {
        return value.policies.length < 1;
      }).map(([key, _]: any) => {
        return key;
      });
    emptyRoles.forEach((role) => delete roles[role]);

    Object.entries(roles)
      .map(([_, value]: any) => {
        value.policies = this.sanitizeItems(value.policies);
      });
    return roles;
  }
}
