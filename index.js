const { server: WebSocketServer } = require('websocket');

const httpServer = require('http').createServer().listen(8080);

const World = require('./world');

const world = new World();
world.emitUpdate = () => {
	for (const [id, callback] of callbacks) {
		callback(JSON.stringify({ uid: id, users: world.users }));
	}
};

const server = new WebSocketServer({
	httpServer,
});

let nonce = 0;

/**
 * @type {Array<[uid: string, (data: string) => void]>}
 */
const callbacks = [];

server.on('request', request => {
	const conn = request.accept();
	const id = 'user#' + nonce++;
	world.addUser(id, id);
	callbacks.push([id, message => conn.sendUTF(message)]);
	conn.on('message', message => {
		if (message.type === 'utf8') {
			try {
				const { cmd, body } = JSON.parse(message.utf8Data);
				switch (cmd) {
					case 'set-name':
						world.updateUserName(id, body);
						console.log('Setting name of', id, 'to', body);
						break;
					case 'set-position':
						world.updateUserPosition(id, body.x, body.y);
						console.log('Setting position of', id, 'to', body);
						break;
				}
			} catch (e) {
				console.error(`client #${id}: ${e}`);
			}
		}
	});
	conn.on('close', () => {
		world.removeUser(id);
		console.log('connection closed');
	});
});
