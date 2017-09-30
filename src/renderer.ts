import NoteRepository from './NoteRepository';

const repository: NoteRepository = new NoteRepository();

const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
const bodyInput: HTMLTextAreaElement = document.getElementById('note-body-input') as HTMLTextAreaElement;
const noteList: HTMLUListElement = document.querySelector('#note-list > ul') as HTMLUListElement;
const statusBar: HTMLElement = document.getElementById('status-bar-inner') as HTMLElement;

repository.getAll().then(notes => {
  notes.forEach((note: any) => {
    const item: HTMLLIElement = document.createElement('li') as HTMLLIElement;
    item.innerText = note.title;
    item.addEventListener('click', () => {
      titleInput.value = note.title;
      bodyInput.textContent = note.body;
      statusBar.innerText = `id: ${note._id}`;
    });
    noteList.appendChild(item);
  });
});

function getTitle(): string {
  return titleInput.value;
}

function getBody(): string {
  return bodyInput.textContent as string;
}

statusBar.innerText = 'This is status bar';

document.addEventListener('keydown', (e: any) => {
  console.log(e);
  if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
    repository.add(getTitle(), getBody());
  }
});
