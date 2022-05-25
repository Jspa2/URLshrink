import config from './config'

const validateId = (id: string): Boolean => {
	return id.length === config.idLength && id.split('').every(char => config.idChars.includes(char));
};

export default validateId;