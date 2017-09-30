import NoteRepository from './NoteRepository';
import * as $ from 'jquery';
import NoteList from './NoteList';

const repository: NoteRepository = new NoteRepository();

export function getRepository(): NoteRepository {
  return repository;
}

const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
const bodyInput: HTMLTextAreaElement = document.getElementById('note-body-input') as HTMLTextAreaElement;
const deleteButton: JQuery = $('#note-delete-button');
const noteList: NoteList =  new NoteList();
const statusBar: HTMLElement = document.getElementById('status-bar-inner') as HTMLElement;

let openedNoteId: string|null = null;

export function getOpenedNoteId(): string|null {
  return openedNoteId;
}

// open a new note when note parameter is null
export function changeOpenedNote(note: any): void {
  if (note !== null) {
    openedNoteId = note._id;
    titleInput.value = note.title;
    bodyInput.textContent = note.body;
    deleteButton.show();
    setStatusBar(`id: ${note._id}`);
  } else {
    openedNoteId = null;
    titleInput.value = '';
    bodyInput.textContent = '';
    deleteButton.hide();
    setStatusBar('New Note');
  }
}

function getTitle(): string {
  return titleInput.value;
}

function getBody(): string {
  return bodyInput.textContent as string;
}

function setStatusBar(text: string): void {
  statusBar.innerText = text;
}

function registerKeyEventHandler(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    console.log(e);
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      if (openedNoteId === null) {
        return repository.add(getTitle(), getBody()).then(id => {
          openedNoteId = id;
        }).then(() => {
          return noteList.refresh();
        });
      }
      // TODO prevent updating when not modified
      return repository.update(openedNoteId, getTitle(), getBody()).then(() => {
        return noteList.refresh();
      });
    }
    // TODO: Press Ctrl+N to create a new note
    return;
  });
}

function setupNoteDeleteButton(): void {
  deleteButton.on('click', () => {
    if (window.confirm('Delete this note?')) {
      if (openedNoteId === null) {
        throw new Error();
      }
      return repository.remove(openedNoteId).then(() => {
        changeOpenedNote(null);
        return noteList.refresh();
      });
    }
    return;
  });
}

registerKeyEventHandler();
changeOpenedNote(null);
noteList.refresh();
setupNoteDeleteButton();
