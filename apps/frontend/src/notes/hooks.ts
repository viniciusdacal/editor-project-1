import { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import * as SharedTypes from '@mochary/backend/shared/types';
import { NoteWSEventTypes, Note } from '@mochary/backend/shared/types/Notes';
import useSocketIO from '../useSocketIO';
import withCollaboration from './withCollaboration';
import { createEditor, Operation, Editor } from 'slate';

// If you want to use GraphQL API or libs like Axios, you can create your own fetcher function.
// Check here for more examples: https://swr.vercel.app/docs/data-fetching
const fetcher = async (input: RequestInfo, init: RequestInit) => {
  const res = await fetch(input, init);
  return res.json();
};

export const useNotesList = () => {
  const { data, error } = useSWR<SharedTypes.Notes.NotesResponse>(
    `${process.env.NEXT_PUBLIC_REST_API_BASE}/notes`,
    fetcher
  );

  return {
    notesList: data?.notes,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useNote = (id: string) => {
  const cachedRef = useRef<Record<string, any>>({});
  const [note, setNote] = useState<SharedTypes.Notes.Note | null>(null);
  const WS_URL = `${process.env.NEXT_PUBLIC_WS_BASE}`;
  const { send, socket, status } = useSocketIO(WS_URL, {
    onConnect: (socketId, send) => {
      send(NoteWSEventTypes.READ_NOTE, {
        type: NoteWSEventTypes.READ_NOTE,
        id,
      });
    },
    listeners: {
      [NoteWSEventTypes.REPLACE]: (payload: Note) => {
        setNote(payload);

        cachedRef.current.editor.children = payload.content;
      },
      [NoteWSEventTypes.NEW_OPERATIONS]: ({
        operations,
      }: {
        id: string;
        operations: Operation[];
      }) => {
        Editor.withoutNormalizing(cachedRef.current.editor, () => {
          operations.forEach((operation) => {
            cachedRef.current.apply(operation);
          });
        });
      },
    },
  });

  const [editor, apply] = useMemo(() => {
    let batch: Operation[] = [];
    let promise: null | Promise<void> = null;

    return withCollaboration(createEditor(), async (operation) => {
      console.log('sent', operation);

      if (
        ![
          'insert_text',
          'remove_text',
          'remove_node',
          'split_node',
          'set_node',
          'merge_node',
        ].includes(operation.type)
      ) {
        console.log('falta na lista', operation.type);
      }

      if (operation.type !== 'set_selection') {
        batch.push(operation);
      }

      if (promise) {
        return;
      }

      promise = Promise.resolve();
      await promise;

      const operations = batch;
      promise = null;
      batch = [];

      cachedRef.current.send(NoteWSEventTypes.NEW_OPERATIONS, {
        id,
        operations,
      });
    });
  }, []);

  cachedRef.current.send = send;
  cachedRef.current.apply = apply;
  cachedRef.current.editor = editor;

  return {
    apply,
    editor,
    socket,
    note,
    status,
  };
};
