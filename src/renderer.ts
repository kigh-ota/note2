import NoteRepository from './NoteRepository';
import * as $ from 'jquery';

const repository: NoteRepository = new NoteRepository();

const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
const bodyInput: HTMLTextAreaElement = document.getElementById('note-body-input') as HTMLTextAreaElement;
const noteList: HTMLUListElement = document.querySelector('#note-list > ul') as HTMLUListElement;
const statusBar: HTMLElement = document.getElementById('status-bar-inner') as HTMLElement;

function clearNoteList(): void {
  noteList.innerHTML = '';
}

let openedNoteId: string|null = null;

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
          titleInput.value = note.title;
          bodyInput.textContent = note.body;
          openedNoteId = note._id;
          $(noteList).find('li').removeClass('opened-note');
          item.classList.add('opened-note');
          setStatusBar(`id: ${note._id}`);
        });
        noteList.appendChild(item);
      });
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
      repository.add(getTitle(), getBody());
    }
  });
}

registerKeyEventHandler();
refreshNoteList();
