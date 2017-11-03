import * as $ from 'jquery';
import {noteApp} from './renderer';
import StringUtil from './StringUtil';

export default class NoteList {
  private el: JQuery;
  private sortSwitcher: JQuery;
  private isSortByTitle: boolean;
  private sortKeyword: string;

  constructor() {
    this.el = $('#note-list').find('ul');
    this.sortSwitcher = $('#note-sort-switcher');
    this.isSortByTitle = false;
    this.sortKeyword = '';

    this.sortSwitcher.on('click', () => {
      this.isSortByTitle = !this.isSortByTitle;
      this.refresh();
    });
  }

  private clear(): void {
    this.el.empty();
  }

  private highlightOpenedNote(): void {
    this.el.find('li').removeClass('opened-note');
    this.el.find(`li[data-id=${noteApp.getOpenedNoteId()}]`).addClass('opened-note');
  }

  refresh(keyword?: string): Promise<any> {
    if (typeof keyword !== 'undefined') {
      this.sortKeyword = keyword;
    }
    return noteApp.repository.getAll().then(notes => {
      this.clear();
      const sortedNotes = notes
        .filter((note: any) => {
          if (!this.sortKeyword) {
            // no filtering
            return true;
          }
          const titleMatchWord = note.title.toLocaleLowerCase().indexOf(this.sortKeyword.toLocaleLowerCase()) !== -1;
          const tagsMatchWord = Array.from(StringUtil.getTags(note.body))
            .some(tag => tag.toLocaleLowerCase().indexOf(this.sortKeyword.toLocaleLowerCase()) !== -1);
          return titleMatchWord || tagsMatchWord;
        })
        .sort((a: any, b: any) => {
          if (this.isSortByTitle) {
            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
          } else {
            return new Date(a.updatedAt).toISOString() > new Date(b.updatedAt).toISOString() ? -1 : 1;
          }
        });
      sortedNotes.forEach((note: any) => {
        const item = $('<li></li>').text(note.title);
        item.attr('data-id', note._id);
        item.attr('title', this.getNoteToolTip(note));
        item.on('click', () => {
          return noteApp.saveNote().then(() => {
            return this.refresh();
          }).then(() => {
            noteApp.changeOpenedNote(note);
            this.highlightOpenedNote();
          });
        });
        item.appendTo(this.el);
      });
      this.highlightOpenedNote();
    });
  }

  private getNoteToolTip(note: any) {
    return `${note.title}\n id: ${note._id}\n createdAt: ${note.createdAt}\n updatedAt: ${note.updatedAt}`;
  }
}
