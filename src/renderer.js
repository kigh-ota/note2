import PouchDB from 'pouchdb';

const noteList = document.getElementById('note-list');

for (let i = 1; i <= 100; i += 1) {
  const item = document.createElement('ul');
  item.innerText = `Note ${i}`;
  noteList.appendChild(item);
}

const db = new PouchDB('http://localhost:5984/test');

/**
 * @param {string} title
 * @param {string} body
 * @returns {Promise<any>}
 */
function addNote(title, body) {
  return db.get(title)
    .then(() => Promise.reject('Note already exists'))
    .catch(() => {
      const dt = new Date().toISOString();
      return db.put({
        _id: title,
        title,
        body,
        createdAt: dt,
        updatedAt: dt,
      });
    });
}

/**
 * @param {string} title
 * @param {string} body
 * @returns {Promise<any>}
 */
function updateNote(title, body) {
  return db.get(title)
    .then(doc => db.put({
      _id: title,
      _rev: doc._rev,
      title,
      body,
      createdAt: doc.createdAt,
      updatedAt: new Date().toISOString(),
    }))
    .catch(() => Promise.reject('Note not found'));
}

addNote('TITLE', 'BODY');
updateNote('TITLE', 'BODY');
