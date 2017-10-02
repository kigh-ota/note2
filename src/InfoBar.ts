import * as $ from 'jquery';
import {shell} from 'electron';

export default class InfoBar {
  private el: JQuery;

  constructor() {
    this.el = $('#info-bar');
  }

  public update(tags: Set<string>, urls: Set<string>): void {
    this.el.empty();
    tags.forEach(tag => {
      const tagEl = $(`<span>${tag}</span>`);
      tagEl.addClass('tag');
      this.el.append(tagEl);
    });
    urls.forEach(url => {
      const urlEl = $(`<span title="${url}">@</span>`);
      urlEl.addClass('url');
      urlEl.click(() => {
        const ret = shell.openExternal(url);
      });
      this.el.append(urlEl);
    });
  }
}
