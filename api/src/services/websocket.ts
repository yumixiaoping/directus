import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import env from '../env';
import logger from '../logger';
import { parse } from 'url';

export class WebSocketService {
	server: WebSocket.Server;
	graphqlServer: WebSocket.Server;

	constructor(server: http.Server) {
		this.server = new WebSocketServer({ server });
		this.graphqlServer = new WebSocketServer({ noServer: true });

		this.server.on('listening', () => {
			const port = env.PORT;
			logger.info(`WebSocket server started at ws://localhost:${port}`);
		});

		this.server.on('upgrade', (request, socket, head) => {
			const { pathname } = parse(request.url);

			if (pathname === '/graphql') {
				this.graphqlServer.handleUpgrade(request, socket, head, (ws) => {
					ws.emit('connection', ws, request);
				});
			} else {
				this.server.handleUpgrade(request, socket, head, (ws) => {
					ws.emit('connection', ws, request);
				});
			}
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
