import { Descendant, Operation } from 'slate';

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
  REPLACE = 'note:replace',
}

export interface NoteAction<T = string> {
  type: NoteActionType;
  message?: T;
}

export enum NoteWSEventTypes {
  READ_NOTE = 'notes:read',
  REPLACE = 'notes:replace',
  UPDATE = 'notes:update',
  NEW_OPERATIONS = 'notes:NEW_OPERATIONS',
}

export interface WSEvent<ET = string, P = any> {
  type: ET;
  payload: P;
}

export type ReadNoteWSEvent = WSEvent<
  NoteWSEventTypes,
  {
    id: string;
  }
>;

export type ReplaceNoteWSEvent = WSEvent<NoteWSEventTypes.REPLACE, Note>;
export type UpdateNoteWSEvent = WSEvent<
  NoteWSEventTypes.UPDATE,
  { id: string } & Partial<Note>
>;

export type NewOperationNoteWSEvent = WSEvent<
  NoteWSEventTypes.NEW_OPERATIONS,
  { id: string; operations: Operation[] }
>;
