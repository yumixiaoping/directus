import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import logger from '../logger';
import { parse } from 'url';
import { GraphQLService } from './graphql';
import { useServer as useGraphQLServer } from 'graphql-ws/lib/use/ws';
import { getSchema } from '../utils/get-schema';
import { getAccountabilityForToken } from '../utils/get-accountability-for-token';

export class WebSocketService {
	server: WebSocket.Server;
	graphqlServer: WebSocket.Server;

	constructor(httpServer: http.Server) {
		this.server = new WebSocketServer({ noServer: true });
		this.graphqlServer = new WebSocketServer({ noServer: true });

		httpServer.on('upgrade', (request, socket, head) => {
			const { pathname } = parse(request.url!);

			if (pathname === '/graphql') {
				this.graphqlServer.handleUpgrade(request, socket, head, (ws) => {
					this.graphqlServer.emit('connection', ws, request);
				});
			} else {
				this.server.handleUpgrade(request, socket, head, (ws) => {
					this.server.emit('connection', ws, request);
				});
			}
		});

		useGraphQLServer(
			{
				context: {},
				schema: async (ctx) => {
					const accountability = await getAccountabilityForToken(ctx.connectionParams?.token as string | undefined);

					const service = new GraphQLService({
						schema: await getSchema(),
						scope: 'items',
						accountability,
					});

					return service.getSchema();
				},
			},
			this.graphqlServer
		);

		this.server.on('connection', (ws) => {
			ws.on('message', (data) => {
				logger.trace(`[WSS] Received: ${data}`);
			});

			ws.send('something');
		});

		this.graphqlServer.on('connection', (ws) => {
			ws.on('message', (data) => {
				logger.trace(`[WSS GraphQL] Received: ${data}`);
			});
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
