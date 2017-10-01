import * as $ from 'jquery';
import {noteApp} from './renderer';

export default class StatusBar {
  private el: JQuery;
  private body: string;

  constructor() {
    this.el = $('#status-bar-inner');
    this.body = '';
  }

  public update(text?: string) {
    const modified = noteApp.isNoteModified();
    if (typeof text !== 'undefined') {
      this.body = text;
    }
    this.el.text((modified ? '* ' : '') + this.body);
  }
}