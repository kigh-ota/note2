import * as $ from 'jquery';

export default class InfoBar {
  private el: JQuery;

  constructor() {
    this.el = $('#info-bar');
  }

  public showTags(tags: Set<string>): void {
    this.el.empty();
    tags.forEach(tag => {
      const tagEl = $(`<span>${tag}</span>`);
      tagEl.addClass('tag');
      this.el.append(tagEl);
    });
  }
}
