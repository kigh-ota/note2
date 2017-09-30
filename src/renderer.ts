import NoteRepository from './NoteRepository';
import * as $ from 'jquery';

const repository: NoteRepository = new NoteRepository();

const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
const bodyInput: HTMLTextAreaElement = document.getElementById('note-body-input') as HTMLTextAreaElement;
const deleteButton: JQuery = $('#note-delete-button');
const noteList: HTMLUListElement = document.querySelector('#note-list > ul') as HTMLUListElement;
const statusBar: HTMLElement = document.getElementById('status-bar-inner') as HTMLElement;

function clearNoteList(): void {
  noteList.innerHTML = '';
}

let openedNoteId: string|null = null;

function highlightOpenedNote(): void {
  $(noteList).find('li').removeClass('opened-note');
  $(noteList).find(`li[data-id=${openedNoteId}]`).addClass('opened-note');
}

// open a new note when note parameter is null
function changeOpenedNote(note: any): void {
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

function refreshNoteList(): Promise<any> {
  clearNoteList();
  return repository.getAll().then(notes => {
    notes
      .sort((a: any, b: any) => a.updatedAt > b.updatedAt ? -1 : 1)
      .forEach((note: any) => {
        const item: HTMLLIElement = document.createElement('li') as HTMLLIElement;
        item.innerText = note.title;
        item.dataset.id = note._id;
        item.addEventListener('click', () => {
          changeOpenedNote(note);
          highlightOpenedNote();
        });
        noteList.appendChild(item);
      });
    highlightOpenedNote();
  });
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
          return refreshNoteList();
        });
      }
      // TODO prevent updating when not modified
      return repository.update(openedNoteId, getTitle(), getBody()).then(() => {
        return refreshNoteList();
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
        return refreshNoteList();
      });
    }
    return;
  });
}

registerKeyEventHandler();
changeOpenedNote(null);
refreshNoteList();
setupNoteDeleteButton();
