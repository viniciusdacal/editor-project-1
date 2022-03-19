import express, { RequestHandler, Response } from 'express'
import { WebsocketRequestHandler } from 'express-ws'
import { parseJSON } from '../../shared/utils';
import * as SharedTypes from '../../shared/types';

import NotesService from './notes.service';


// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method')
patch.default(express.Router)

const router = express.Router();

const notesService = new NotesService();

interface NotesHandlers {
  getNotes: RequestHandler;
  note: WebsocketRequestHandler;
}

const handlers: NotesHandlers = {
  getNotes: async (_req, res: Response<SharedTypes.Notes.NotesResponse>) => {
    const notes = await notesService.getNotes(['id', 'title']);
    
    res.json({
      notes: notes,
    })
  },
  note: (ws, req) => {
    ws.on('message', async (data) => {
      const action = parseJSON<SharedTypes.Notes.NoteAction>(data.toString()) as SharedTypes.Notes.NoteAction;

      if (!action.type) {
        console.log(`wrong message format, expect a NoteAction, got: ${data}`)
        return;
      }

      switch(action.type) {
        case SharedTypes.Notes.NoteActionType.READ: {
          const note = await notesService.getNote(req.params.id);
          ws.send(JSON.stringify(note));
          break;
        }
      }
      
    })
  },
};

router.get('/', handlers.getNotes)
router.ws('/:id', handlers.note)

export default router