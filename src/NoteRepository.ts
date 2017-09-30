import PouchDB from 'pouchdb';

export default class NoteRepository {
  private db: PouchDB.Database;

  constructor() {
    this.db = new PouchDB('http://localhost:5984/test');
  }

  getAll(): Promise<any> {
    return this.db.allDocs({include_docs: true}).then((result) => {
      return result.rows.map(row => row.doc);
    });
  }

  /**
   * returns null when a note is not found
   */
  getByTitle(title: string): Promise<any> {
    if (!title) {
      return Promise.reject('Invalid title');
    }
    return this.db.allDocs({include_docs: true}).then((result) => {
      const matchRow = result.rows.find((row: any) => row.doc.title === title);
      if (matchRow === undefined) {
        return null;
      }
      return matchRow.doc;
    });
  }

  existsWithTitle(title: string): Promise<boolean> {
    if (!title) {
      return Promise.reject('Invalid title');
    }
    return this.getByTitle(title).then(note => {
      return note !== null;
    });
  }

  // returns id
  add(title: string, body: string): Promise<string> {
    if (!title) {
      return Promise.reject('Invalid title');
    }
    return this.existsWithTitle(title).then(exists => {
      if (exists) {
        return Promise.reject(`Note with title "${title}" already exists`);
      }
      const dt = new Date().toISOString();
      return this.db.post({
        title,
        body,
        createdAt: dt,
        updatedAt: dt,
      });
    }).then(resp => {
      console.log('Note added', resp);
      return resp.id;
    });
  }

  update(id: string, title: string, body: string): Promise<any> {
    if (!title) {
      return Promise.reject('Invalid title');
    }
    return Promise.all([this.db.get(id), this.getByTitle(title)]).then((results) => {
      const noteById: any = results[0];
      const noteByTitle: any = results[1];
      // comes here only when note with id was found
      if (noteByTitle !== null && noteByTitle._id !== id) {
        return Promise.reject(`Note with title "${title}" already exists`);
      }
      return this.db.put({
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

  remove(id: string): Promise<any> {
    return this.db.get(id).then(note => {
      return this.db.remove(id, note._rev);
    }).catch(() => {
      return Promise.reject('Note not found');
    });
  }
}
