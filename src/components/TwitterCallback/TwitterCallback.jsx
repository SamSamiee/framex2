import React, { useEffect, useContext } from "react";
import { TwitterContext } from "../../Contexts/TwitterProvider";
import twitterService from "../../services/twitterService";

function TwitterCallback() {
	const { saveTwitterToken } = useContext(TwitterContext);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				// Get URL parameters
				const urlParams = new URLSearchParams(window.location.search);
				const oauth_token = urlParams.get("oauth_token");
				const oauth_verifier = urlParams.get("oauth_verifier");
				const denied = urlParams.get("denied");

				if (denied) {
					// User denied authorization
					window.close();
					return;
				}

				if (!oauth_token || !oauth_verifier) {
					throw new Error("Missing OAuth parameters");
				}

				// Get stored request token secret from sessionStorage
				const oauth_token_secret = sessionStorage.getItem(
					"twitter_oauth_token_secret"
				);
				if (!oauth_token_secret) {
					throw new Error("Missing OAuth token secret");
				}

				// Exchange for real access token
				const tokenData = await twitterService.getAccessToken(
					oauth_token,
					oauth_token_secret,
					oauth_verifier
				);

				// Save token data
				await saveTwitterToken(tokenData);

				// Clean up
				sessionStorage.removeItem("twitter_oauth_token_secret");

				// Notify parent window and close
				if (window.opener) {
					window.opener.postMessage(
						{
							type: "TWITTER_AUTH_SUCCESS",
							data: tokenData,
						},
						window.location.origin
					);
				}

				window.close();
			} catch (error) {
				console.error("Twitter callback error:", error);

				// Notify parent window of error
				if (window.opener) {
					window.opener.postMessage(
						{
							type: "TWITTER_AUTH_ERROR",
							error: error.message,
						},
						window.location.origin
					);
				}

				window.close();
			}
		};

		handleCallback();
	}, [saveTwitterToken]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				fontFamily: "Arial, sans-serif",
			}}>
			<div style={{ textAlign: "center" }}>
				<h2>Connecting your Twitter account...</h2>
				<p>Please wait while we complete the authentication process.</p>
				<div
					style={{
						border: "4px solid #f3f3f3",
						borderTop: "4px solid #1da1f2",
						borderRadius: "50%",
						width: "40px",
						height: "40px",
						animation: "spin 2s linear infinite",
						margin: "20px auto",
					}}></div>
				<style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
			</div>
		</div>
	);
}

export default TwitterCallback;
