import express, { Express } from 'express';
import { connect }  from './db';
import config from './config'

import shorten from './routes/shorten';
import forward from './routes/forward';

const app: Express = express();
const port = process.env.PORT || config.defaultPort;

async function run() {
	console.log('Connecting to MongoDB...');
	try {
		await connect();
		console.log('Connected to MongoDB');

		app.use(express.static('public'));
		app.use(express.urlencoded({ extended: true }));
		app.use('/', shorten);
		app.use('/', forward);

		app.listen(port, () => console.log(`Listening on port ${port}`));
	} catch {
		console.log('Failed to start server');
		process.exit(1);
	}
}
run().catch(console.error);