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

  protected showError = ({ error }: HttpErrorResponse) => {
    const { details } = error;
    details.forEach(errorDetail => {
      if (!this.isConfigModification(errorDetail['@type'])) {
        this.formErrorMessage = errorDetail['description'];
        this.isFormValid = false;
        this.isFormValidated = true;
      }
    });
  }

  protected displayFieldErrorMessage = (error, moduleName, form) => {
    const { details } = error;
    if (details) {
      details.forEach(errorDetail => {
        const path = moduleName + '/' + form.get('id').value + '/';
        const fieldName = errorDetail['resourceName'].replace(path, '').replace('/', '.');
        if (fieldName.length > 0) {
          form.get(fieldName).setErrors({
            serverError: errorDetail['description'],
          });
        } else {
          this.formErrorMessage = errorDetail['description'];
          this.isFormValid = false;
          this.isFormValidated = true;
        }
      });
    } else {
      this.formErrorMessage = error;
      this.isFormValid = false;
      this.isFormValidated = true;
    }
  }

  protected isConfigModification(errorType: string) {
    return errorType.includes('ConfigModification');
  }

}
