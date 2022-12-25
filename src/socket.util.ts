import { io } from 'socket.io-client';
import { BASE_URL } from './constants/constants';
let socketClient: any;

export default {
  init: () => {
    socketClient = io(BASE_URL);
    return socketClient;
  },
  get: () => {
    if (!socketClient) {
      throw new Error('socket is not initialized');
    }
    return socketClient;
  },
};
