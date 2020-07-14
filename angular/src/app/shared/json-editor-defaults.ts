import { JsonEditorOptions } from 'ang-jsoneditor';

export class JsonEditorDefaults extends JsonEditorOptions {

  constructor() {
    super();
    this.mode = 'view';
    this.mainMenuBar = false;
    this.navigationBar = false;
    this.statusBar = false;
  }
}
