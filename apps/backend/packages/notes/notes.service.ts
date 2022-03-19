import { Descendant } from 'slate'
import db from '../../firebase';
import { parseJSON } from '../../shared/utils';
import * as SharedTypes from '../../shared/types';


type Note = SharedTypes.Notes.Note;

const noteConverter = {
  toFirestore: (note: Omit<Note, 'id'> & { id?: string }): FirebaseFirestore.DocumentData => ({
    id: note.id,
    title: note.title,
    content: note.content
  }),
  fromFirestore: (
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): Note => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      content: (parseJSON<Descendant[]>(data.content) || []) as Descendant[],
    };
  }
};

const notesRef = db.collection('notes').withConverter(noteConverter);

const mapNote = (doc: FirebaseFirestore.QueryDocumentSnapshot<Note>) => doc.data();

export default class NotesService {
  async getNote(id: string): Promise<Note> {
    const doc = await notesRef.doc(id).withConverter(noteConverter).get();
    if (!doc.exists) {
      throw new Error('Document not found');
    }

    return doc.data()!;
  }

  async getNotes(fields: Array<keyof Note>): Promise<Pick<Note, typeof fields[number]>[]> {
    const result = await notesRef
      .select(...fields)
      .withConverter(noteConverter)
      .get();
      
    return result.docs.map(mapNote);
  }

  async updateNote(id: string, payload: Omit<Partial<Note>, 'id'>): Promise<void> {
    await notesRef
      .doc(id)
      .withConverter(noteConverter)
      .set(payload, { merge: true });
  }
}