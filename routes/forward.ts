import express, { Router, Request, Response } from 'express';
import { urls } from '../db';
import validateId from '../validateId';
const router: Router = express.Router();

let cache: { [key: string]: string } = {};

router.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	if (!validateId(id)) {
		res.status(400).send('Invalid URL');
		return;
	}

	// Find destination
	let destination: string;
	try {
		if (cache[id]) {
			destination = cache[id];
		} else {
			destination = await urls.findOne({ id }).then(doc => doc?.destination);
			cache[id] = destination;
		}

		if (!destination) {
			res.status(404).send('URL not found');
			console.log(`URL not found: ${id}`);
			return;
		}

		// Redirect
		res.redirect(301, destination);

		// Log hit
		console.log(`Hit: ${id}`);
		urls.updateOne({ id }, { $inc: { hits: 1 } });
	} catch {
		res.status(500).send('An error occurred');
		console.error(`Failed to redirect: ${id}`);
		return;
	}
});

export default router;