import React from "react";
import { Trash, Twitter, Edit } from "react-feather";
import styles from "./styles.module.css";
import FourSquare from "../FourSquare";
import { FileContext } from "../../Contexts/FileProvider";
import { InsertContext } from "../../Contexts/InsertProvider";
import { TwitterContext } from "../../Contexts/TwitterProvider";

function Cart({ urls, imageIds, children, id }) {
	const { handleDeleteCard, handleEditCard } = React.useContext(FileContext);
	const { setInsertDataForEdit } = React.useContext(InsertContext);
	const { twitterConnected, connectTwitter, postTweet } =
		React.useContext(TwitterContext);
	const [isPosting, setIsPosting] = React.useState(false);
	const size = "2em";

	const handleEdit = () => {
		handleEditCard(id, setInsertDataForEdit);
	};

	const handlePostToTwitter = async () => {
		if (!twitterConnected) {
			// If not connected, prompt user to connect
			if (
				window.confirm(
					"You need to connect your Twitter account first. Would you like to connect now?"
				)
			) {
				await connectTwitter();
			}
			return;
		}

		try {
			setIsPosting(true);

			// Get the first image URL for the post
			const firstImageUrl =
				urls && urls.length > 0 ? urls[0]?.url || urls[0] : null;

			// Create the tweet text
			const tweetText = children || "Check out my post from FrameX! 🖼️";

			// Post tweet directly through API
			await postTweet(tweetText, firstImageUrl);

			// Show success message
			alert(
				"🐦 Tweet posted!\n\nOpened Twitter's compose window with your content. Complete the post there!"
			);
		} catch (err) {
			console.error("Error posting tweet:", err);
			alert("Failed to post tweet. Please try again.");
		} finally {
			setIsPosting(false);
		}
	};

	return (
		<div className={styles.cart}>
			<p className={styles.p}>{children}</p>
			<FourSquare urls={urls} />
			<div className={styles.controller}>
				<button
					type="button"
					className={`${styles.Button} ${styles.twitter}`}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handlePostToTwitter();
					}}
					disabled={isPosting}
					title={
						twitterConnected ? "Post to Twitter" : "Connect Twitter account"
					}>
					{isPosting ? (
						<div style={{ fontSize: "0.8em" }}>...</div>
					) : (
						<Twitter size={size} color="white" />
					)}
				</button>
				<div className={styles.adjust}>
					<button
						className={styles.edit}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleEdit();
						}}>
						<Edit size={size} />
					</button>
					<button
						className={styles.delete}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							console.log("Button clicked:", e.target);
							console.log(
								"Button is in view?",
								e.target.getBoundingClientRect()
							);
							handleDeleteCard(id, imageIds);
						}}>
						<Trash size={size} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
