/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from 'react'
import useSWR from 'swr'
import * as SharedTypes from "@mochary/backend/shared/types";
import { parseJSON } from '@mochary/backend/shared/utils';
import useWebSocket, { ReadyState } from 'react-use-websocket'

// If you want to use GraphQL API or libs like Axios, you can create your own fetcher function. 
// Check here for more examples: https://swr.vercel.app/docs/data-fetching
const fetcher = async (
  input: RequestInfo,
  init: RequestInit
) => {
  const res = await fetch(input, init);
  return res.json();
}

export const useNotesList = () => {
  const { data, error } = useSWR<SharedTypes.Notes.NotesResponse>('http://localhost:3001/api/notes', fetcher)

  return {
    notesList: data?.notes,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useNote = (id: string) => {
  const { readyState, lastMessage, sendJsonMessage } = useWebSocket(`ws://localhost:3001/api/notes/${id}`)

  // Send a message when ready on first load
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendJsonMessage({
        type: SharedTypes.Notes.NoteActionType.READ,
      });
    }
  }, [readyState, lastMessage])
  

  return {
    note: parseJSON<SharedTypes.Notes.NotesResponse>(lastMessage?.data),
    readyState,
  }
}