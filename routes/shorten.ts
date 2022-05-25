import express, { Router, Request, Response } from 'express';
import config from '../config'
import { urls } from '../db';
import generateId from '../generateId';
const router: Router = express.Router();

let lastRequest: { [key: string]: number } = {};

router.post('/shorten', (req: Request, res: Response) => {
	const urlString = req.body.url;
	let url: URL;

	// Validate URL
	if (!urlString || !urlString.trim()) {
		res.status(400).send({ type: 'error', message: 'No URL specified' });
		return;
	}
	if (urlString.length > config.maxUrlLength) {
		res.status(400).send(({ type: 'error', message: `URL must be less than ${config.maxUrlLength} characters` }));
		return;
	}
	try {
		url = new URL(urlString);
	} catch {
		// Handle unspecified protocol
		if (config.assumeProtocol) {
			try {
				url = new URL(`${config.assumeProtocol}//${urlString}`);
			} catch {
				console.log(`Invalid URL: ${urlString}`);
				res.status(400).send({ type: 'error', message: 'Invalid URL' });
				return;
			}
		} else {
			res.status(400).send({ type: 'error', message: 'Invalid URL' });
			return;
		}
	}

	// Allowed protocols and hostnames
	if (!config.allowedProtocols.includes(url.protocol)) {
		res.status(403).send({ type: 'error', message: 'Protocol not allowed' });
		return;
	}
	if (url.hostname === new URL(config.host).hostname) {
		res.status(400).send({ type: 'error', message: 'Cannot shorten this website' });
		return;
	}

	// Cooldown
	if (lastRequest[req.ip] && Date.now() - lastRequest[req.ip] < config.shortenCooldown) {
		res.status(429).send(({ type: 'error', message: `Oops! You're doing that too fast.` }));
		return;
	}
	lastRequest[req.ip] = Date.now();

	// Shorten URL
	const id = generateId();
	const shortUrl = `${config.host}/${id}`;
	try {
		urls.insertOne({
			id,
			created: new Date(),
			creationIp: req.ip,
			destination: url.href,
			hits: 0
		});
		res.send(({ type: 'ok', url: shortUrl }));
		console.log(`Shortened URL: ${url.href} to ${shortUrl}`);
	} catch {
		res.status(500).send({ type: 'error', message: 'An error occurred' });
		console.error(`Failed to insert URL: ${url.href}`);
	}
});

export default router;