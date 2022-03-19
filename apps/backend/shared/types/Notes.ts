import { Descendant } from 'slate';

export interface Note {
  id: string;
  title: string;
  content: Descendant[];
}

export interface NotesResponse {
  notes: Note[];
}

export enum NoteActionType {
  DELETE = 'note:delete',
  CREATE = 'note:create',
  READ = 'note:read',
  UPDATE = 'note:update',
}

export interface NoteAction {
  type: NoteActionType;
  message?: string;
}

