class World {
	users = {};
	emitUpdate = function () {};

	getState() {
		return this.users;
	}

	addUser(id, name) {
		this.users[id] = {
			name,
			x: 0,
			y: 0,
			rotation: {
				y: 0,
			},
		};
		this.emitUpdate();
	}

	removeUser(id) {
		delete this.users[id];
		this.emitUpdate();
	}

	updateUserName(id, name) {
		this.users[id].name = name;
		this.emitUpdate();
	}

	updateUserPosition(id, x, y) {
		this.users[id].x = x;
		this.users[id].y = y;
		this.emitUpdate();
	}

	updateUserRotation(id, y) {
		this.users[id].rotation.y = y;
		this.emitUpdate();
	}
}

module.exports = World;
