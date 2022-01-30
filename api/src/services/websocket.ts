import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import env from '../env';
import logger from '../logger';

export class WebSocketService {
	server: WebSocket.Server;

	constructor(server: http.Server) {
		this.server = new WebSocketServer({ server });

		this.server.on('listening', () => {
			const port = env.PORT;
			logger.info(`WebSocket server started at ws://localhost:${port}`);
		});

		this.server.on('connection', (ws) => {
			ws.on('message', (data) => {
				console.log('received: %s', data);
			});

			ws.send('something');
		});
	}

	/**
	 * Terminate all open connections
	 */
	terminate() {
		this.server.clients.forEach((ws) => {
			ws.terminate();
		});
	}
}
