import React from 'react'
import { Editor } from '../editor'
import { useNote } from './hooks'
import { SocketStatus } from '../useSocketIO';

import { Paper, TextField, Badge, BadgeTypeMap } from '@mui/material'

interface SingleNoteProps {
  id: string
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const { note, editor, status } = useNote(id);

  const connectionStatusColor = {
    [SocketStatus.CONNECTING]: 'info',
    [SocketStatus.OPEN]: 'success',
    [SocketStatus.CLOSING]: 'warning',
    [SocketStatus.CLOSED]: 'error',
    [SocketStatus.UNINSTANTIATED]: 'error',
  }[status] as BadgeTypeMap['props']['color']

  return note ? (
    <>
      <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
        <TextField
          value={note.title}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor editor={editor} initialValue={note.content} />
      </Paper>
    </>
  ) : null
}

export default Home