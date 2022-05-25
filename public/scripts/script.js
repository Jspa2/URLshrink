// Configuration
const SHOW_COPIED_TIME = 2000;

const $ = (selector) => document.getElementById(selector);

let shortUrl;

// Whether the 'Copied!' message is currently visible
let showingCopied = false;
let loading = false;

// Shrink URL
$('form').addEventListener('submit', (e) => {
	if ($('url').value.trim() === '' || loading) { e.preventDefault(); return; }
	loading = true;
	e.preventDefault();

	$('loader').classList.add('show');
	$('error-message').classList.remove('show');
	$('error-message').textContent = '';
	$('success').classList.remove('show');

	const request = new Request(`/shorten`, { 
        method: 'POST', 
        body: `url=${encodeURIComponent($('form').url.value)}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
    });

	fetch(request)
		.then(response => response.json())
		.then(data => {
			if (data.type === 'error') {
				$('error-message').innerText = data.message;
				$('error-message').classList.add('show');
				$('loader').classList.remove('show');
				loading = false;
				return;
			}
			shortUrl = data.url;
			$('url-display').textContent = shortUrl;
			$('success').classList.add('show');
			$('loader').classList.remove('show');
			loading = false;
		}).catch(() => {
			$('error-message').innerText = 'Oops! Something went wrong. Please try again later.';
			$('error-message').classList.add('show');
			$('loader').classList.remove('show');
			loading = false;
		});
});

// Copy button
$('short-url-container').addEventListener('click', () => {
	if (showingCopied) return;
	showingCopied = true;

	navigator.clipboard.writeText(shortUrl);
	$('copied').classList.add('show');

	setTimeout(() => {
		$('copied').classList.remove('show');
		showingCopied = false;
	}, SHOW_COPIED_TIME);
});