import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Form } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';
import { debounceTime, tap } from 'rxjs/operators';

import { dam } from '../../../../../shared/proto/dam-service';

import { ResourceFormBuilder } from './resource-form-builder.service';
import { ResourceViewFormComponent } from './resource-view-form/resource-view-form.component';

import Resource = dam.v1.Resource;

@Component({
  selector: 'ddap-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss'],
  entryComponents: [ResourceViewFormComponent],
})
export class ResourceFormComponent implements OnInit, AfterViewInit, Form {

  @Input()
  resource?: EntityModel = new EntityModel('', Resource.create());
  @Output()
  readonly formChange: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  viewRefs: EmbeddedViewRef<ResourceViewFormComponent>[] = [];
  @ViewChild('viewTemplate', { static: false })
  viewTemplateRef: TemplateRef<any>;
  @ViewChild('views', { read: ViewContainerRef, static: false })
  container: ViewContainerRef;
  @ViewChildren(ResourceViewFormComponent)
  viewChildComponents: QueryList<ResourceViewFormComponent>;

  constructor(private formBuilder: FormBuilder,
              private resourceFormBuilder: ResourceFormBuilder,
              private cd: ChangeDetectorRef) {
  }

  get views() {
    return _get(this.resource, 'dto.views', {});
  }

  ngOnInit(): void {
    this.form = this.resourceFormBuilder.buildForm(this.resource);
  }

  ngAfterViewInit(): void {
    if (!this.views) {
      return;
    }
    Object.keys(this.views).forEach((viewId) => this.addView(viewId));
    this.cd.detectChanges();
  }

  addView(viewId?: string) {
    const view = new EntityModel(viewId,  _get(this.views, viewId, null));
    const _id = new Date().getTime().toString();
    this.viewRefs.push(this.container.createEmbeddedView(
      this.viewTemplateRef,
      { $implicit: { ...view, _id } },
      0
    ));
  }

  removeView({ _id }: any) {
    const embeddedView = this.viewRefs.find((component) => component.context['$implicit']._id === _id);
    embeddedView.destroy();
    this.resourceFormChange();
  }

  getModel(): EntityModel {
    const views: any = this.getViewChildrenForms()
      .map(view => this.getViewModel(view))
      .reduce((previousValue, currentValue) => {
        return Object.assign(previousValue, currentValue);
      }, {});

    const { id, ui, maxTokenTtl } = this.form.value;
    const resource = {
      maxTokenTtl,
      ui,
      views,
    };

    return new EntityModel(id, resource);
  }

  getViewModel(viewForm: FormGroup) {
    const { id, variables, roles, ...rest } = viewForm.value;
    const args = this.getVariables(viewForm);

    return {
      [id]: {
        items: [{ args }],
        roles: this.sanitizeRoles(roles),
        ...rest,
      },
    };
  }

  getVariables(viewForm: FormGroup) {
    const { variables } = viewForm.value;
    if (!variables) {
      return {};
    }

    return variables
    // Form will only validate if optional values are empty
    // Don't send optional variables to the server
      .filter((variable) => variable.value !== '')
      .map((variable) => {
        if (Array.isArray(variable.value )) {
          variable.value = variable.value.join(';');
        }
        return {
          [variable.name]: variable.value,
        };
      }).reduce((previousValue, currentValue) => {
        return Object.assign(previousValue, currentValue);
      }, {});
  }

  isValid() {
    return this.form.valid && this.viewChildComponents
      .map((viewComponent) => viewComponent.viewForm.valid)
      .every((valid => valid === true));
  }

  getAllForms(): FormGroup[] {
    return [...this.getViewChildrenForms(), this.form];
  }

  resourceFormChange(values?) {
    this.formChange.emit(values);
  }

  setFormControlErrors(errorDetails: object) {
    const viewForms = this.getViewChildrenForms();
    viewForms.forEach(viewForm => {
      const viewId = viewForm.value.id;
      if (errorDetails['resourceName'].includes(viewId)) {
        const fieldsPath = errorDetails['resourceName']
          .replace(new RegExp('^.+' + viewId + '\/'), '');
        if (fieldsPath.includes('policies')) {
          const fieldName = fieldsPath.match(/^.+(policies)/)[0]
            .replace(/\//g, '.');
          this.setServerError(fieldName, viewForm, errorDetails);
        } else if (fieldsPath.includes('roles')) {
          this.setServerError('roles', viewForm, errorDetails);
        } else if (fieldsPath.includes('items')) {
          this.setServerError('variables', viewForm, errorDetails);
        } else {
          const fieldName = fieldsPath.replace(/\//g, '.');
          if (fieldName.length > 0) {
            this.setServerError(fieldName, viewForm, errorDetails);
          }
        }
      }
    });
  }

  private setServerError(fieldControlName, form, errorDetails) {
    form.get(fieldControlName).setErrors({
      serverError: errorDetails['description'],
    });
    form.get(fieldControlName).markAsTouched();
  }


  private getViewChildrenForms(): FormGroup[] {
    if (!this.viewChildComponents) {
      return [];
    }
    return this.viewChildComponents.map(view => view.viewForm);
  }

  private sanitizeRoles(roles) {
    if (!roles) {
      return {};
    }

    const emptyRoles = Object.entries(roles)
      .filter(([_, value]: any) => {
        return value.policies.length < 1;
      }).map(([key, _]: any) => {
        return key;
      });
    emptyRoles.forEach((role) => delete roles[role]);

    Object.entries(roles)
      .forEach(([_, roleValue]: any) => {
        roleValue.policies.forEach((policy) => {
          delete policy.display; // needs to be deleted because ngx-chips (tag-input) adds this value
          delete policy.value; // needs to be deleted because ngx-chips (tag-input) adds this value
        });
      });

    return roles;
  }

  private subscribeToFormChanges() {
    this.form.valueChanges.pipe(
      debounceTime(300),
      tap(() => this.resourceFormChange())
    ).subscribe();
  }

}
