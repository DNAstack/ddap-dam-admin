import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfigOptionEditDialogComponent } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OptionService } from '../options.service';

@Component({
  selector: 'ddap-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss'],
})
export class OptionListComponent implements OnInit {

  readonly displayedColumns: string[] = ['label', 'description', 'defaultValue', 'value', 'moreActions'];

  options$: Observable<any>;
  error: string;
  formControls: { [key: string]: FormControl } = {};
  currentlyEditing: string;

  constructor(
    public optionService: OptionService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.options$ = this.optionService.get()
      .pipe(
        tap((options: any) => {
          Object.entries(options.descriptors)
            .forEach(([key, _]: any) => {
              this.formControls[key] = this.getFormControl(options, key);
            });
        })
      );
  }

  updateOptionValue(options, optionKey, newValue) {
    this.error = null;
    const newOptions: any = this.cloneOptions(options);

    const type: string = newOptions.descriptors[optionKey].type;
    if (type.startsWith('string')) {
      const pattern = newOptions.descriptors[optionKey].regexp;
      const regexp: RegExp = new RegExp(pattern);
      if (regexp && regexp.test(newValue)) {
        newOptions[optionKey] = newValue;
      } else {
        this.error = `Please match the requested format ${pattern}`;
      }
    } else if (type.includes('int')) {
      const newValueAsInt = Number(newValue);
      if (isNaN(newValueAsInt)) {
        this.error = `Value must be a number`;
      }
      const max: number = newOptions.descriptors[optionKey].max;
      const min: number = newOptions.descriptors[optionKey].min;
      if (max && newValueAsInt > max) {
        this.error = `Value must be less or equal to ${max}`;
      }
      if (min && newValueAsInt < min) {
        this.error = `Value must be more or equal to ${min}`;
      }
      newOptions[optionKey] = newValueAsInt;
    } else if (type.includes('bool')) {
      const newValueLowerCased = newValue?.toLowerCase();
      if (newValueLowerCased !== 'true' && newValueLowerCased !== 'false') {
        this.error = `Value must be True or False`;
      }
      // cast to boolean
      newOptions[optionKey] = newValueLowerCased === 'true';
    } else {
      newOptions[optionKey] = newValue;
    }

    // do not continue if there is error
    if (this.error) {
      return;
    }
    this.optionService.update(newOptions)
      .subscribe(
        () => {
          options[optionKey] = newOptions[optionKey];
          this.currentlyEditing = null;
        },
        ({ error }) => this.error = error?.message
      );
  }

  openEditDialog(options, optionKey) {
    this.dialog.open(ConfigOptionEditDialogComponent, {
      disableClose: true, // prevent closing dialog by clicking on backdrop
      width: '30rem',
      data: {
        label: options.descriptors[optionKey].label,
        description: options.descriptors[optionKey].description,
        value: options[optionKey],
      },
    }).afterClosed()
      .subscribe(({ acknowledged, newValue }) => {
        if (acknowledged) {
          this.updateOptionValue(options, optionKey, newValue);
        }
      });
  }

  private cloneOptions(options): object {
    return Object.assign({}, options);
  }

  private getFormControl(options, optionKey): FormControl {
    const optionDescriptor = options.descriptors;
    const validators = [];

    if ('regexp' in optionDescriptor[optionKey]) {
      validators.push(Validators.pattern(optionDescriptor[optionKey].regexp));
    } else if (optionDescriptor[optionKey]?.type === 'bool') {
      const pattern = '^(true|false){1}$';
      validators.push(Validators.pattern(pattern));
    }

    return new FormControl(options[optionKey], validators);
  }

}
