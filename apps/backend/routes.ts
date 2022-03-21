import express from 'express';
import notesRouter from './packages/notes/routes';

const router = express.Router();

router.use('/notes', notesRouter);

export default router;
