import {io} from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000');