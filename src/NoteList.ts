import {changeOpenedNote, getOpenedNoteId, getRepository, saveNote} from './renderer';
import * as $ from 'jquery';

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
    this.el.find(`li[data-id=${getOpenedNoteId()}]`).addClass('opened-note');
  }

  refresh(): Promise<any> {
    return getRepository().getAll().then(notes => {
      this.clear();
      const sortedNotes = notes.sort((a: any, b: any) => a.updatedAt > b.updatedAt ? -1 : 1);
      sortedNotes.forEach((note: any) => {
        const item = $('<li></li>').text(note.title);
        item.attr('data-id', note._id);
        item.on('click', () => {
          return saveNote().then(() => {
            return this.refresh();
          }).then(() => {
            changeOpenedNote(note);
            this.highlightOpenedNote();
          });
        });
        item.appendTo(this.el);
      });
      this.highlightOpenedNote();
    });
  }
}
