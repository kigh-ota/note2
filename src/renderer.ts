import NoteRepository from './NoteRepository';
import * as $ from 'jquery';
import NoteList from './NoteList';
import NoteBodyInput from './NoteBodyInput';

// TODO: filtering

const repository: NoteRepository = new NoteRepository();

export function getRepository(): NoteRepository {
  return repository;
}

const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
const bodyInput: NoteBodyInput = new NoteBodyInput();
const deleteButton: JQuery = $('#note-delete-button');
const statusBar: HTMLElement = document.getElementById('status-bar-inner') as HTMLElement;

const noteList: NoteList =  new NoteList();

let openedNoteId: string|null = null;

export function getOpenedNoteId(): string|null {
  return openedNoteId;
}

// open a new note when note parameter is null
export function changeOpenedNote(note: any): void {
  if (note !== null) {
    openedNoteId = note._id;
    titleInput.value = note.title;
    bodyInput.setValue(note.body);
    deleteButton.show();
    setStatusBar(`id: ${note._id}`);
  } else {
    openedNoteId = null;
    titleInput.value = '';
    bodyInput.setValue('');
    deleteButton.hide();
    setStatusBar('New Note');
  }
}

function getTitle(): string {
  return titleInput.value;
}

function setStatusBar(text: string): void {
  statusBar.innerText = text;
}

export function saveNote(): Promise<any> {
  const title = getTitle();
  const body = bodyInput.getValue();
  if (openedNoteId === null) {
    if (title === '' && body === '') {
      return Promise.resolve();
    }
    return repository.add(title, body).then(id => {
      return repository.get(id);
    }).then(note => {
      changeOpenedNote(note);
      return;
    });
  }
  // TODO prevent updating when not modified
  console.log(title, body);
  return repository.update(openedNoteId, title, body);
}

function registerKeyEventHandler(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    console.log(e);
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      return saveNote().then(() => {
        return noteList.refresh();
      });
    } else if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) {
      return saveNote().then(() => {
        changeOpenedNote(null);
        return noteList.refresh();
      });
    }
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
