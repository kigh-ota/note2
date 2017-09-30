import PouchDB from 'pouchdb';

const db = new PouchDB('http://localhost:5984/test');

function getAllNotes(): Promise<any> {
  return db.allDocs({ include_docs: true }).then(result => result.rows.map(row => row.doc));
}

/**
 * returns null when a note is not found
 */
function getNoteByTitle(title: string): Promise<any> {
  if (!title) {
    return Promise.reject('Invalid title');
  }
  return db.allDocs({ include_docs: true }).then((result) => {
    const matchRow = result.rows.find((row: any) => row.doc.title === title);
    if (matchRow === undefined) {
      return null;
    }
    return matchRow.doc;
  });
}

function existsNoteWithTitle(title: string): Promise<boolean> {
  if (!title) {
    return Promise.reject('Invalid title');
  }
  return getNoteByTitle(title).then(note => {
    if (note === null) {
      return false;
    }
    return true;
  });
}

function addNote(title: string, body: string): Promise<any> {
  if (!title) {
    return Promise.reject('Invalid title');
  }
  return existsNoteWithTitle(title).then(exists => {
    if (exists) {
      return Promise.reject(`Note with title "${title}" already exists`);
    }
    const dt = new Date().toISOString();
    return db.post({
      title,
      body,
      createdAt: dt,
      updatedAt: dt,
    });
  }).then(resp => {
    console.log('Note added', resp);
    return resp;
  });
}

/*
function updateNote(id: string, title: string, body: string): Promise<any> {
  if (!title) {
    Promise.reject('Invalid title');
  }
  return Promise.all([db.get(id), getNoteByTitle(title)]).then((results) => {
    const noteById = results[0];
    const noteByTitle = results[1];
    // comes here only when note with id was found
    if (noteByTitle !== null && noteByTitle._id !== id) {
      return Promise.reject(`Note with title "${title}" already exists`);
    }
    return db.put({
      _id: id,
      _rev: noteById._rev,
      title,
      body,
      createdAt: noteById.createdAt,
      updatedAt: new Date().toISOString(),
    }).then(resp => {
      console.log('Note updated', resp);
      return resp;
    }).catch(() => Promise.reject('Error in updating a note'));
  });
}
*/

const noteList: HTMLUListElement = document.querySelector('#note-list > ul') as HTMLUListElement;
getAllNotes().then(notes => {
  notes.forEach((note: any) => {
    const item = document.createElement('li');
    item.innerText = note.title;
    noteList.appendChild(item);
  });
});

/*
addNote('TITLE', 'BODY\nLINE2').then(resp => {
  const id = resp.id;
  return updateNote(id, 'TITLE', 'BODY\nLINE2');
});
*/

function getTitle(): string {
  const titleInput: HTMLInputElement = document.getElementById('note-title-input') as HTMLInputElement;
  return titleInput.value;
}

function getBody(): string {
  const bodyInput: HTMLTextAreaElement = document.getElementById('note-body-input') as HTMLTextAreaElement;
  return bodyInput.textContent as string;
}

document.addEventListener('keydown', (e: any) => {
  console.log(e);
  if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
    addNote(getTitle(), getBody());
  }
});
