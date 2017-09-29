import PouchDB from 'pouchdb';

const noteList = document.getElementById('note-list');

for (let i = 1; i <= 100; i += 1) {
  const item = document.createElement('ul');
  item.innerText = `Note ${i}`;
  noteList.appendChild(item);
}

const db = new PouchDB('http://localhost:5984/test');

const doc = {
  _id: 'あいうえお',
  name: 'Mittens',
  occupation: 'kitten',
  age: 3,
};
db.put(doc);
