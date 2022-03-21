import express, { RequestHandler, Response } from 'express';
import * as SharedTypes from '../../shared/types';

import NotesService from './notes.service';

const router = express.Router();

const notesService = new NotesService();

interface NotesHandlers {
  getNotes: RequestHandler;
}

const handlers: NotesHandlers = {
  getNotes: async (_req, res: Response<SharedTypes.Notes.NotesResponse>) => {
    const notes = await notesService.getNotes(['id', 'title']);

    res.json({
      notes: notes,
    });
  },
};

router.get('/', handlers.getNotes);

export default router;
