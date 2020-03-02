import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OptionService } from '../options.service';

@Component({
  selector: 'ddap-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss'],
})
export class OptionListComponent implements OnInit {

  displayedColumns: string[] = ['label', 'description', 'type', 'defaultValue', 'value', 'moreActions'];

  options$: Observable<any>;
  error: string;
  currentlyEditing: string;

  constructor(public optionService: OptionService) {
  }

  ngOnInit() {
    this.options$ = this.optionService.get();
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


}
