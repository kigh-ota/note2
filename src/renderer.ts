import NoteRepository from './NoteRepository';
import * as $ from 'jquery';
import NoteList from './NoteList';
import NoteBodyInput from './NoteBodyInput';
import NoteTitleInput from './NoteTitleInput';
import StatusBar from './StatusBar';

// TODO: filtering
// TODO: preserve window size

const repository: NoteRepository = new NoteRepository();

export function getRepository(): NoteRepository {
  return repository;
}

const deleteButton: JQuery = $('#note-delete-button');

let openedNoteId: string|null = null;
let originalNote: {title: string, body: string} = {title: '', body: ''};

export function getOpenedNoteId(): string|null {
  return openedNoteId;
}

const noteList: NoteList =  new NoteList();
const titleInput: NoteTitleInput = new NoteTitleInput();
const bodyInput: NoteBodyInput = new NoteBodyInput();

function updateOriginalNote(): void {
  originalNote = {
    title: titleInput.getValue(),
    body: bodyInput.getValue(),
  };
}

export function isNoteModified(): boolean {
  return originalNote.title !== titleInput.getValue() || originalNote.body !== bodyInput.getValue();
}

const statusBar: StatusBar = new StatusBar();

export function getStatusBar(): StatusBar {
  return statusBar;
}

// open a new note when note parameter is null
export function changeOpenedNote(note: any): void {
  if (note !== null) {
    openedNoteId = note._id;
    titleInput.setValue(note.title);
    bodyInput.setValue(note.body);
    updateOriginalNote();
    deleteButton.show();
    statusBar.update(`id: ${note._id}`);
  } else {
    openedNoteId = null;
    titleInput.setValue('');
    bodyInput.setValue('');
    updateOriginalNote();
    deleteButton.hide();
    statusBar.update('New Note');
  }
}

export function saveNote(): Promise<any> {
  const title = titleInput.getValue();
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
  return repository.update(openedNoteId, title, body).then(() => {
    updateOriginalNote();
  });
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
        titleInput.focus();
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
        titleInput.focus();
        return noteList.refresh();
      });
    }
    return;
  });
}

registerKeyEventHandler();
changeOpenedNote(null);
titleInput.focus();
noteList.refresh();
setupNoteDeleteButton();
