import { Socket } from 'socket.io';
import Slate, { createEditor, Editor } from 'slate';
import Automerge from 'automerge';
import {
  NoteWSEventTypes,
  ReadNoteWSEvent,
  NewOperationNoteWSEvent,
  Note,
} from '../../shared/types/Notes';
import NotesService from './notes.service';

const cache = new Map<string, any>();

export default function initialize(socket: Socket) {
  const notes = new NotesService();

  socket.on(NoteWSEventTypes.READ_NOTE, async (event: ReadNoteWSEvent) => {
    const note = await notes.getNote(event.payload.id);
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(event.payload.id);

    socket.emit(NoteWSEventTypes.REPLACE, {
      type: NoteWSEventTypes.REPLACE,
      payload: note,
    });
  });

  const promises = new Map<string, Promise<void>>();
  const operations = [];
  socket.on(
    NoteWSEventTypes.NEW_OPERATIONS,
    async (event: NewOperationNoteWSEvent) => {
      const id = event.payload.id;
      let editor: any = cache.get(id);

      if (!editor) {
        const note = await notes.getNote(id);
        editor = createEditor();
        editor.children = note.content;
        cache.set(id, editor);
      }

      try {
        Editor.withoutNormalizing(editor, () => {
          event.payload.operations.forEach((operation) => {
            editor.apply(operation);
          });
        });

        socket
          .to(event.payload.id)
          .except(socket.id)
          .emit(NoteWSEventTypes.NEW_OPERATIONS, {
            type: NoteWSEventTypes.NEW_OPERATIONS,
            payload: {
              id: event.payload.id,
              operations: event.payload.operations,
            },
          });

        if (promises.has(id)) {
          return;
        }

        // This will batch all updates that happen in the same tick on the event loop.
        promises.set(id, Promise.resolve());
        await promises.get(id);
        promises.delete(id);
        await notes.updateNote(event.payload.id, { content: editor.children });
      } catch (error) {
        console.log(error);
      }
    }
  );
}
