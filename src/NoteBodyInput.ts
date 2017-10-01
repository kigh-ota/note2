import * as $ from 'jquery';

export default class NoteBodyInput {
  private el: JQuery;

  constructor() {
    this.el = $('#note-body-input');
  }

  public setValue(value: string): void {
    this.el.val(value);
  }

  public getValue(): string {
    return this.el.val() as string;
  }
}
