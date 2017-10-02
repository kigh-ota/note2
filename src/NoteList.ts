import * as $ from 'jquery';
import {noteApp} from './renderer';
import StringUtil from './StringUtil';

export default class NoteList {
  private el: JQuery;

  constructor() {
    this.el = $('#note-list').find('ul');
  }

  private clear(): void {
    this.el.empty();
  }

  private highlightOpenedNote(): void {
    this.el.find('li').removeClass('opened-note');
    this.el.find(`li[data-id=${noteApp.getOpenedNoteId()}]`).addClass('opened-note');
  }

  refresh(keyword?: string): Promise<any> {
    return noteApp.repository.getAll().then(notes => {
      this.clear();
      const sortedNotes = notes
        .filter((note: any) => {
          if (!keyword) {
            // no filtering
            return true;
          }
          const titleMatchWord = note.title.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1;
          const tagsMatchWord = Array.from(StringUtil.getTags(note.body))
            .some(tag => tag.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1);
          return titleMatchWord || tagsMatchWord;
        })
        .sort((a: any, b: any) => a.updatedAt > b.updatedAt ? -1 : 1);
      sortedNotes.forEach((note: any) => {
        const item = $('<li></li>').text(note.title);
        item.attr('data-id', note._id);
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
}
