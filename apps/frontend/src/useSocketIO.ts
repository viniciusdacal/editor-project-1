import { useCallback, useMemo, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { NoteWSEventTypes, WSEvent } from '@mochary/backend/shared/types/Notes';

export enum SocketStatus {
  UNINSTANTIATED = -1,
  CONNECTING = 1,
  OPEN = 2,
  CLOSING = 3,
  CLOSED = 4,
}

interface UseSocketIOOptions {
  onMessage?: (message: any) => void;
  onConnect?: (
    socketId: string,
    send: (event: string, message: any) => void
  ) => void;
  listeners?: Record<string, (message: any) => void>;
}

export default function useSocketIO(
  socketURL: string,
  options: UseSocketIOOptions
) {
  const [status, setStatus] = useState(SocketStatus.CLOSED);
  const socket = useMemo(() => {
    const socket = io(socketURL, {
      transports: ['websocket'],
      autoConnect: false,
    });

    socket.on('message', (message) => {
      options?.onMessage?.(message);
    });

    socket.on('connect', () => {
      setStatus(SocketStatus.OPEN);
      const send = (event: string, payload: any) => {
        socket.emit(event, {
          type: event,
          payload,
        });
      };
      options?.onConnect?.(socket.id, send);
    });

    socket.io.on('error', () => {
      setStatus(SocketStatus.CLOSED);
    });

    socket.io.on('reconnect', () => {
      setStatus(SocketStatus.OPEN);
    });

    Object.entries(options.listeners || {}).forEach(([event, listener]) => {
      socket.on(event, (message: WSEvent) => {
        listener(message.payload);
      });
    });

    return socket;
  }, []);

  const send = useCallback(
    (event: NoteWSEventTypes, payload: any) => {
      socket.emit(event, {
        type: event,
        payload,
      });
    },
    [socket]
  );

  useEffect(() => {
    setStatus(SocketStatus.CONNECTING);
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    status,
    socket,
    send,
  };
}
