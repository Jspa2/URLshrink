import { MongoClient, Collection } from 'mongodb';
import config from './config'

const client: MongoClient = new MongoClient(config.mongoDbUrl);
let urls: Collection;

async function connect() {
	await client.connect();
	urls = client.db('urlshrink').collection('urls');
}

export {urls as urls, connect as connect}