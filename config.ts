const config = {
	// The canonical URL of the server running URLshrink, without a trailing slash.
	"host": "http://localhost",

	// The default port that will be used if one is not set in the enviroment.
	"defaultPort": 80,

	// The allowed protocols to shorten.
	"allowedProtocols": ["http:", "https:"],

	// The protocol that will be used if none is specified.
	"assumeProtocol": "https:",

	// Configure ID generation.
	"idChars": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
	"idLength": 6,

	// The maximum length of URLs.
	"maxUrlLength": 256,

	// How long the cooldown is between shortening URLs, in milliseconds.
	"shortenCooldown": 5000,

	// The URL for the database.
	"mongoDbUrl": "mongodb://127.0.0.1:27017",
}

export default config;