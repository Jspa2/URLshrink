import config from './config'

const generateId = (): String => {
	let id = '';
	for (let i = 0; i < config.idLength; i++) {
		id += config.idChars[Math.floor(Math.random() * config.idChars.length)];
	}
	return id;
}

export default generateId;