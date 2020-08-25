import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from 'ddap-common-lib';
import { FormValidationService } from 'ddap-common-lib';

import { DamConfigEntityComponentBase } from './dam-config-entity-component.base';
import { DamConfigEntityType } from './dam-config-entity-type.enum';

export class DamConfigEntityFormComponentBase extends DamConfigEntityComponentBase {

  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService) {
    super();
  }

  protected validate(form: Form): boolean {
    this.formErrorMessage = null;
    this.isFormValid = this.validationService.validate(form);
    this.isFormValidated = true;
    return this.isFormValid;
  }

  protected navigateUp = (path: string) => this.router.navigate([path], { relativeTo: this.route });

  // This method is specific to Resource form
  protected showError = ({ error }: HttpErrorResponse) => {
    const { details, message } = error;
    if (details) {
      details.forEach(errorDetail => {
        if (!this.isConfigModification(errorDetail['@type'])) {
          this.formErrorMessage = errorDetail['description'];
        }
      });
    } else if (message) {
      this.formErrorMessage = message;
    } else {
      this.formErrorMessage = error;
    }
    this.isFormValid = false;
    this.isFormValidated = true;
  }

  // This method is used in all admin forms other than Resource
  protected displayFieldErrorMessage = (error, moduleName, form) => {
    const { details, message } = error;
    if (details) {
      details.forEach(errorDetail => {
        const path = `${moduleName}/${form.get('id').value}/`;
        const trailingSlashFreeResourceName = this.removeTrailingSlash(errorDetail['resourceName']);
        const fieldName = trailingSlashFreeResourceName
          .replace(path, '')
          .replace(/\//g, '.');
        if (fieldName.length > 0) {
          form.get(fieldName).setErrors({
            serverError: errorDetail['description'],
          });
          form.get(fieldName).markAsTouched();
        } else {
          this.formErrorMessage = errorDetail['description'];
        }
      });
    } else if (message) {
      this.formErrorMessage = message;
    } else {
      this.formErrorMessage = error;
    }
    this.isFormValid = false;
    this.isFormValidated = true;
  }

  protected isConfigModification(errorType: string) {
    return errorType.includes('ConfigModification');
  }

  protected clearError() {
    this.formErrorMessage = null;
    this.isFormValid = true;
    this.isFormValidated = true;
  }

  private removeTrailingSlash = (path: string): string => {
    return path.endsWith('/')
           ? path.slice(0, -1)
           : path;
  }

}
