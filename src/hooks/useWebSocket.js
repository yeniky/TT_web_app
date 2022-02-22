import { useEffect } from 'react';

//redux
import { useDispatch } from 'react-redux';

import { updateTagSocket } from 'redux/tag/tag.actions';

import { updateAlertSocket, fetchAlerts } from 'redux/alerts/alerts.actions';

//socket
import socketIOClient from 'socket.io-client';

const useWebSocket = (endpoint) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on('data_message', (payload) => {
      dispatch(updateTagSocket(payload.data));
    });
    socket.on('data_alert', (payload) => {
      dispatch(updateAlertSocket(payload.data));
    });
    socket.on('closed_alert', (payload) => {
      dispatch(fetchAlerts());
    });
    return () => {
      socket.close();
    };
  }, [endpoint, dispatch]);
};

export default useWebSocket;
