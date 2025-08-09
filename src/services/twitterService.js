import CryptoJS from 'crypto-js';

// Real Twitter API service for frontend
class TwitterService {
	constructor() {
		this.apiKey = process.env.REACT_APP_TWITTER_API_KEY;
		this.apiSecret = process.env.REACT_APP_TWITTER_API_SECRET;
		this.bearerToken = process.env.REACT_APP_TWITTER_BEARER_TOKEN;

		// Twitter API endpoints
		this.baseUrl = 'https://api.twitter.com';
		this.requestTokenUrl = `${this.baseUrl}/oauth/request_token`;
		this.authorizeUrl = `${this.baseUrl}/oauth/authorize`;
		this.accessTokenUrl = `${this.baseUrl}/oauth/access_token`;
		this.tweetUrl = `${this.baseUrl}/1.1/statuses/update.json`;
		
		if (!this.apiKey || !this.apiSecret) {
			console.warn("Twitter API credentials missing. Check your .env file.");
		}
	}

	// Generate OAuth signature for Twitter API requests
	generateOAuthSignature(method, url, parameters, consumerSecret, tokenSecret = '') {
		// Sort parameters
		const sortedParams = Object.keys(parameters)
			.sort()
			.map(key => `${this.percentEncode(key)}=${this.percentEncode(parameters[key])}`)
			.join('&');

		// Create signature base string
		const signatureBaseString = [
			method.toUpperCase(),
			this.percentEncode(url),
			this.percentEncode(sortedParams)
		].join('&');

		// Create signing key
		const signingKey = `${this.percentEncode(consumerSecret)}&${this.percentEncode(tokenSecret)}`;

		// Generate signature
		const signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey).toString(CryptoJS.enc.Base64);
		return signature;
	}

	// Percent encode for OAuth
	percentEncode(str) {
		return encodeURIComponent(str)
			.replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
	}

	// Generate OAuth parameters
	generateOAuthParams(additionalParams = {}) {
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		return {
			oauth_consumer_key: this.apiKey,
			oauth_nonce: nonce,
			oauth_signature_method: 'HMAC-SHA1',
			oauth_timestamp: timestamp,
			oauth_version: '1.0',
			...additionalParams
		};
	}

	// Get request token from Twitter API
	async getRequestToken() {
		try {
			const callbackUrl = `${window.location.origin}/twitter-callback`;
			const oauthParams = this.generateOAuthParams({
				oauth_callback: callbackUrl
			});

			// Generate signature
			const signature = this.generateOAuthSignature(
				'POST',
				this.requestTokenUrl,
				oauthParams,
				this.apiSecret
			);

			oauthParams.oauth_signature = signature;

			// Create authorization header
			const authHeader = 'OAuth ' + Object.keys(oauthParams)
				.map(key => `${this.percentEncode(key)}="${this.percentEncode(oauthParams[key])}"`)
				.join(', ');

			// Make request to Twitter
			const response = await fetch(this.requestTokenUrl, {
				method: 'POST',
				headers: {
					'Authorization': authHeader,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (!response.ok) {
				throw new Error(`Twitter API error: ${response.status}`);
			}

			const responseText = await response.text();
			const params = new URLSearchParams(responseText);

			const oauth_token = params.get('oauth_token');
			const oauth_token_secret = params.get('oauth_token_secret');

			if (!oauth_token || !oauth_token_secret) {
				throw new Error('Invalid response from Twitter API');
			}

			return {
				oauth_token,
				oauth_token_secret,
				auth_url: `${this.authorizeUrl}?oauth_token=${oauth_token}`
			};
		} catch (error) {
			console.error("Error getting Twitter request token:", error);
			throw new Error("Failed to initiate Twitter authentication");
		}
	}

	// Exchange OAuth verifier for access token
	async getAccessToken(oauth_token, oauth_token_secret, oauth_verifier) {
		try {
			const oauthParams = this.generateOAuthParams({
				oauth_token,
				oauth_verifier
			});

			// Generate signature
			const signature = this.generateOAuthSignature(
				'POST',
				this.accessTokenUrl,
				oauthParams,
				this.apiSecret,
				oauth_token_secret
			);

			oauthParams.oauth_signature = signature;

			// Create authorization header
			const authHeader = 'OAuth ' + Object.keys(oauthParams)
				.map(key => `${this.percentEncode(key)}="${this.percentEncode(oauthParams[key])}"`)
				.join(', ');

			// Make request to Twitter
			const response = await fetch(this.accessTokenUrl, {
				method: 'POST',
				headers: {
					'Authorization': authHeader,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (!response.ok) {
				throw new Error(`Twitter API error: ${response.status}`);
			}

			const responseText = await response.text();
			const params = new URLSearchParams(responseText);

			return {
				oauth_token: params.get('oauth_token'),
				oauth_token_secret: params.get('oauth_token_secret'),
				user_id: params.get('user_id'),
				screen_name: params.get('screen_name')
			};
		} catch (error) {
			console.error("Error getting Twitter access token:", error);
			throw new Error("Failed to complete Twitter authentication");
		}
	}

	// Post a real tweet using Twitter API
	async postTweet(text, imageUrl = null, accessToken, accessSecret) {
		try {
			const tweetParams = { status: text };
			const oauthParams = this.generateOAuthParams({
				oauth_token: accessToken
			});

			// Combine all parameters for signature
			const allParams = { ...oauthParams, ...tweetParams };

			// Generate signature
			const signature = this.generateOAuthSignature(
				'POST',
				this.tweetUrl,
				allParams,
				this.apiSecret,
				accessSecret
			);

			oauthParams.oauth_signature = signature;

			// Create authorization header
			const authHeader = 'OAuth ' + Object.keys(oauthParams)
				.map(key => `${this.percentEncode(key)}="${this.percentEncode(oauthParams[key])}"`)
				.join(', ');

			// Create form data for tweet
			const formData = new URLSearchParams();
			formData.append('status', text);

			// Make request to Twitter
			const response = await fetch(this.tweetUrl, {
				method: 'POST',
				headers: {
					'Authorization': authHeader,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Twitter API error response:', errorText);
				throw new Error(`Twitter API error: ${response.status}`);
			}

			const tweetData = await response.json();

			return {
				success: true,
				tweet_id: tweetData.id_str,
				text: tweetData.text,
				posted_at: tweetData.created_at,
				url: `https://twitter.com/${tweetData.user.screen_name}/status/${tweetData.id_str}`
			};
		} catch (error) {
			console.error("Error posting tweet:", error);
			throw new Error("Failed to post tweet: " + error.message);
		}
	}

	// Verify user credentials with Twitter API
	async verifyCredentials(accessToken, accessSecret) {
		try {
			const verifyUrl = `${this.baseUrl}/1.1/account/verify_credentials.json`;
			const oauthParams = this.generateOAuthParams({
				oauth_token: accessToken
			});

			// Generate signature
			const signature = this.generateOAuthSignature(
				'GET',
				verifyUrl,
				oauthParams,
				this.apiSecret,
				accessSecret
			);

			oauthParams.oauth_signature = signature;

			// Create authorization header
			const authHeader = 'OAuth ' + Object.keys(oauthParams)
				.map(key => `${this.percentEncode(key)}="${this.percentEncode(oauthParams[key])}"`)
				.join(', ');

			// Make request to Twitter
			const response = await fetch(verifyUrl, {
				method: 'GET',
				headers: {
					'Authorization': authHeader
				}
			});

			if (!response.ok) {
				return { valid: false };
			}

			const userData = await response.json();
			return {
				valid: true,
				user: userData
			};
		} catch (error) {
			console.error("Error verifying Twitter credentials:", error);
			return { valid: false };
		}
	}
}

export default new TwitterService();
