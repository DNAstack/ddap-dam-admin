import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Form, isExpanded } from 'ddap-common-lib';
import _get from 'lodash.get';
import IPatch = scim.v2.IPatch;
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { scim } from '../../proto/dam-service';
import { LocaleModel, TimezoneModel } from '../locale-metadata/locale-metadata.model';
import { LocaleMetadataService } from '../locale-metadata/locale-metadata.service';
import { ScimService } from '../scim.service';
import { UserService } from '../user.service';

import { PersonalInfoFormBuilder } from './personal-info-form-builder.service';

@Component({
  selector: 'ddap-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
})
export class PersonalInfoFormComponent implements Form, OnInit {

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  get photos() {
    return this.form.get('photos') as FormArray;
  }

  @Input()
  user?: any;
  @Input()
  adminMode: boolean;

  form: FormGroup;
  isExpanded: Function = isExpanded;
  filteredLocales$: Observable<LocaleModel[]>;
  filteredTimezones$: Observable<TimezoneModel[]>;

  constructor(
    private personalInfoFormBuilder: PersonalInfoFormBuilder,
    private userService: UserService,
    private localeMetadataService: LocaleMetadataService
  ) {
  }

  ngOnInit() {
    this.form = this.personalInfoFormBuilder.buildForm(this.adminMode, this.user);
    this.localeMetadataService.getLocales()
      .subscribe((localeMetadataResponse) => {
        const locales = this.mapToArray(localeMetadataResponse.locales);
        const timezones = this.mapToArray(localeMetadataResponse.timeZones);

        this.filteredLocales$ = this.form.get('locale').valueChanges
          .pipe(
            map((value) => this.filter<LocaleModel>(value, locales, 'ui.label'))
          );
        this.filteredTimezones$ = this.form.get('timezone').valueChanges
          .pipe(
            map((value) => this.filter<TimezoneModel>(value, timezones, 'ui.label'))
          );
      });
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  unlinkAccount(email: AbstractControl) {
    const ref = email.get('$ref').value;
    this.userService.patchUser(this.user.id, ScimService.getAccountUnlinkPatch(ref))
      .subscribe(() => window.location.reload());
  }

  makeAttributePrimary(controls: AbstractControl[], controlToBePrimary: AbstractControl): void {
    const unsetAllAttributesAsPrimary = () => {
      controls.forEach((control) => {
        control.get('primary').setValue(false);
      });
    };

    unsetAllAttributesAsPrimary();
    controlToBePrimary.get('primary').setValue(true);
  }

  getModel(): IPatch {
    return  ScimService.getOperationsPatch(this.user, this.form.getRawValue());
  }

  private mapToArray<T>(source: { [id: string]: T }): T[] {
    return Object.entries(source)
      .map(([key, value]: any) => {
        value.id = key;
        return value;
      });
  }

  private filter<T>(value: string, source: T[], path: string): T[] {
    const filterValue = value.toLowerCase();
    return source.filter((option) => _get(option, path, '').toLowerCase().includes(filterValue));
  }

}
