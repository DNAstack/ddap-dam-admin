import { Component, OnInit } from '@angular/core';

import { OptionService } from '../options.service';

@Component({
  selector: 'ddap-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss'],
})
export class OptionListComponent implements OnInit {

  options: any;
  error: string;

  constructor(public optionService: OptionService) {
  }

  ngOnInit() {
    this.optionService.get()
      .subscribe((options) => {
          this.options = options;
        }, this.handleError
      );
  }

  updateOptionValue({ optionKey, newValue }) {
    this.error = null;
    const newOptions = this.cloneOptions();
    const oldValue = newOptions[optionKey];
    try {
      const convertedNewValue = typeof oldValue !== 'string' ? JSON.parse(newValue) : newValue;
      newOptions[optionKey] = convertedNewValue;
      this.optionService.update(newOptions)
        .subscribe(
          () => this.options[optionKey] = convertedNewValue,
          this.handleError
        );
    } catch (e) {
      // The only type of error we expect here a syntax error.
      this.error = `Syntax error. Value should be a ${typeof oldValue}`;
    }
  }

  private cloneOptions(): object {
    return Object.assign({}, this.options);
  }

  private handleError = ({ error }) => {
    if (error instanceof Object) {
      const { details } = error;
      details.forEach(errorDetail => {
        this.error = errorDetail['description'];
      });
    } else {
    //  TODO: show a global error
    }
  }

}
