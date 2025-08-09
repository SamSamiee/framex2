import { TwitterApi } from "twitter-api-v2";

// Twitter OAuth URLs and configuration
const TWITTER_OAUTH_URL = "https://api.twitter.com/oauth/request_token";
const TWITTER_AUTHORIZE_URL = "https://api.twitter.com/oauth/authorize";
const TWITTER_ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token";

class TwitterService {
	constructor() {
		this.apiKey = process.env.REACT_APP_TWITTER_API_KEY;
		this.apiSecret = process.env.REACT_APP_TWITTER_API_SECRET;
		this.bearerToken = process.env.REACT_APP_TWITTER_BEARER_TOKEN;

		// Verify environment variables
		if (!this.apiKey || !this.apiSecret) {
			console.warn("Twitter API credentials missing. Check your .env file.");
		}
	}

	// Step 1: Get request token for OAuth flow
	async getRequestToken() {
		try {
			const oauth = new TwitterApi({
				appKey: this.apiKey,
				appSecret: this.apiSecret,
			});

			// Generate callback URL for your app
			const callbackUrl = `${window.location.origin}/twitter-callback`;

			const requestTokenResponse = await oauth.generateAuthLink(callbackUrl);

			return {
				oauth_token: requestTokenResponse.oauth_token,
				oauth_token_secret: requestTokenResponse.oauth_token_secret,
				auth_url: requestTokenResponse.url,
			};
		} catch (error) {
			console.error("Error getting Twitter request token:", error);
			throw new Error("Failed to initiate Twitter authentication");
		}
	}

	// Step 2: Exchange OAuth verifier for access token
	async getAccessToken(oauth_token, oauth_token_secret, oauth_verifier) {
		try {
			const oauth = new TwitterApi({
				appKey: this.apiKey,
				appSecret: this.apiSecret,
				accessToken: oauth_token,
				accessSecret: oauth_token_secret,
			});

			const accessTokenResponse = await oauth.login(oauth_verifier);

			return {
				oauth_token: accessTokenResponse.accessToken,
				oauth_token_secret: accessTokenResponse.accessSecret,
				user_id: accessTokenResponse.userId,
				screen_name: accessTokenResponse.screenName,
			};
		} catch (error) {
			console.error("Error getting Twitter access token:", error);
			throw new Error("Failed to complete Twitter authentication");
		}
	}

	// Step 3: Post a tweet with optional image
	async postTweet(text, imageUrl = null, accessToken, accessSecret) {
		try {
			const client = new TwitterApi({
				appKey: this.apiKey,
				appSecret: this.apiSecret,
				accessToken: accessToken,
				accessSecret: accessSecret,
			});

			let tweetData = { text };

			// If image URL provided, download and upload it to Twitter
			if (imageUrl) {
				try {
					// Download image
					const imageResponse = await fetch(imageUrl);
					const imageBuffer = await imageResponse.arrayBuffer();

					// Upload image to Twitter
					const mediaUpload = await client.v1.uploadMedia(
						Buffer.from(imageBuffer),
						{
							mimeType:
								imageResponse.headers.get("content-type") || "image/jpeg",
						}
					);

					tweetData.media = { media_ids: [mediaUpload] };
				} catch (imageError) {
					console.warn(
						"Failed to upload image, posting text only:",
						imageError
					);
				}
			}

			// Post the tweet
			const tweet = await client.v2.tweet(tweetData);

			return {
				success: true,
				tweet_id: tweet.data.id,
				text: tweet.data.text,
				posted_at: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error posting tweet:", error);
			throw new Error("Failed to post tweet");
		}
	}

	// Verify user credentials are still valid
	async verifyCredentials(accessToken, accessSecret) {
		try {
			const client = new TwitterApi({
				appKey: this.apiKey,
				appSecret: this.apiSecret,
				accessToken: accessToken,
				accessSecret: accessSecret,
			});

			const user = await client.v2.me();
			return {
				valid: true,
				user: user.data,
			};
		} catch (error) {
			console.error("Error verifying Twitter credentials:", error);
			return { valid: false };
		}
	}
}

export default new TwitterService();
