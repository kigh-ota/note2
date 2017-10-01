import * as $ from 'jquery';
import {isNoteModified} from './renderer';

export default class StatusBar {
  private el: JQuery;
  private body: string;

  constructor() {
    this.el = $('#status-bar-inner');
    this.body = '';
    this.update();
  }

  public update(text?: string) {
    const modified = isNoteModified();
    if (typeof text !== 'undefined') {
      this.body = text;
    }
    this.el.text((modified ? '* ' : '') + this.body);
  }
}