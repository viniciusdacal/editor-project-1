import NotesService from "./notes.service";
import { Note } from './types';

export default class NotesController {
  readonly notes: NotesService;

  constructor() {
    this.notes = new NotesService();
  }

  getNotes(): Promise<Pick<Note, 'id' | 'title'>[]> {
    return this.notes.getNotes(['id', 'title']);
  }

  getNote(id: string): Promise<Note> {
    return this.notes.getNote(id);
  }

  updateNote(id: string): Promise<void> {
    return this.notes.updateNote(id, { title: ''});
  }

}