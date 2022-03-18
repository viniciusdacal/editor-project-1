import express, { RequestHandler, Response } from 'express'
import { WebsocketRequestHandler } from 'express-ws'
import { Note } from './types';

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
  getNote: WebsocketRequestHandler;
}

interface NotesResponse {
  notes: Note[];
}

const handlers: NotesHandlers = {
  getNotes: async (_req, res: Response<NotesResponse>) => {
    const notes = await notesService.getNotes(['id', 'title']);
    
    res.json({
      notes: notes,
    })
  },
  getNote: (ws, req) => {
    ws.on('message', async () => {
      const note = await notesService.getNote(req.params.id);
      ws.send(JSON.stringify(note));
    })
  }
};



router.get('/', handlers.getNotes)
router.ws('/:id', handlers.getNote)

export default router