import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OptionService } from '../options.service';

@Component({
  selector: 'ddap-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss'],
})
export class OptionListComponent implements OnInit {

  expandedRow: string;
  readonly displayedColumns: string[] = ['label', 'description', 'defaultValue', 'value', 'moreActions'];

  options$: Observable<any>;
  error: string;
  formControls: { [key: string]: FormControl } = {};
  currentlyEditing: string;

  constructor(public optionService: OptionService) {
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

  resetValue(options, optionKey) {
    this.formControls[optionKey].reset(options[optionKey]);
    this.currentlyEditing = null;
  }

  updateOptionValue(options, optionKey, newValue) {
    this.error = null;
    const newOptions = this.cloneOptions(options);
    const oldValue = newOptions[optionKey];
    try {
      const convertedNewValue = typeof oldValue !== 'string' ? JSON.parse(newValue) : newValue;
      newOptions[optionKey] = convertedNewValue;

      this.optionService.update(newOptions)
        .subscribe(
          () => {
            options[optionKey] = convertedNewValue;
            this.currentlyEditing = null;
          },
          ({error}) => this.error = error.substring(error.lastIndexOf(':') + 1)
        );
    } catch (e) {
      // The only type of error we expect here a syntax error.
      this.error = `Syntax error. Value should be a ${typeof oldValue}`;
    }
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
