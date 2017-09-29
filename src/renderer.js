import PouchDB from 'pouchdb';


const db = new PouchDB('http://localhost:5984/test');

/**
 * @returns {Promise<any>}
 */
function getAllNotes() {
  return db.allDocs({ include_docs: true }).then(result => result.rows.map(row => row.doc));
}

/**
 * returns null when a note is not found
 * @param {string} title
 * @returns {Promise<any>}
 */
function getNoteByTitle(title) {
  if (!title) {
    return Promise.reject('Invalid title');
  }
  return db.allDocs({ include_docs: true }).then((result) => {
    const matchRow = result.rows.find(row => row.doc.title === title);
    if (matchRow === undefined) {
      return null;
    }
    return matchRow.doc;
  });
}

/**
 *
 * @param {string} title
 * @returns {Promise<boolean>}
 */
function existsNoteWithTitle(title) {
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

/**
 * @param {string} title
 * @param {string} body
 * @returns {Promise<any>}
 */
function addNote(title, body) {
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

/**
 * @param {string} id
 * @param {string} title
 * @param {string} body
 * @returns {Promise<any>}
 */
function updateNote(id, title, body) {
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

const noteList = document.getElementById('note-list');
getAllNotes().then(notes => {
  notes.forEach(note => {
    const item = document.createElement('ul');
    item.innerText = note.title;
    noteList.appendChild(item);
  });
});

addNote('TITLE', 'BODY\nLINE2').then(resp => {
  const id = resp.id;
  return updateNote(id, 'TITLE', 'BODY\nLINE2');
});
