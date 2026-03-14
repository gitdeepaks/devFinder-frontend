import { toast } from "@pheralb/toast";
import axios from "axios";
import { motion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/contstants";
import { addFeed } from "../utils/feed-slice";
import { UserCard } from "./user-card";

const EmptyFeedState = memo(() => (
	<motion.div
		className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.4 }}
	>
		<div className="w-24 h-24 rounded-2xl bg-base-200/80 flex items-center justify-center mb-5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-12 w-12 text-primary/60"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<title>No users</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		</div>
		<h2 className="font-display text-xl font-bold text-base-content">
			No one left to discover
		</h2>
		<p className="mt-2 text-base-content/60 max-w-sm font-medium">
			Check back later for new developers. You can also update your profile to
			get more matches.
		</p>
	</motion.div>
));

const FeedInner = () => {
	const dispatch = useDispatch();
	const feed = useSelector((store) => store.feed);
	const [isLoading, setIsLoading] = useState(false);

	const currentUser = useMemo(
		() => (Array.isArray(feed) && feed.length > 0 ? feed[0] : null),
		[feed],
	);

	const getFeed = async () => {
		try {
			if (Array.isArray(feed) && feed.length > 0) return;
			setIsLoading(true);
			const response = await axios.get(`${BASE_URL}/user/feed`, {
				withCredentials: true,
			});
			const feedData = Array.isArray(response.data)
				? response.data
				: response.data?.data || [];
			dispatch(addFeed(feedData));
		} catch (error) {
			const status = error?.response?.status;
			// If the user is not authenticated yet, silently ignore 401 to avoid noisy toasts on first load
			if (status === 401) {
				console.info("Feed request unauthorized; likely no active session yet.");
			} else {
				console.error("Error fetching feed:", error);
				toast.error({
					text: "Couldn’t load feed",
					description: "Please try again later.",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetch on mount
	useEffect(() => {
		getFeed();
	}, []);

	if (isLoading) {
		return (
			<motion.div
				className="flex flex-col items-center justify-center min-h-[60vh] px-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<span className="loading loading-spinner loading-lg text-primary" />
				<p className="mt-4 text-base-content/60 font-semibold">
					Finding developers…
				</p>
			</motion.div>
		);
	}

	if (!currentUser) {
		return <EmptyFeedState />;
	}

	return (
		<motion.div
			className="py-4 sm:py-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.35 }}
		>
			<div className="max-w-md mx-auto mb-5 text-center">
				<p className="inline-flex items-center gap-2 rounded-full bg-base-200/80 px-3 py-1.5 text-xs font-semibold text-base-content/80 mb-3">
					<span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
					Discover developers nearby
				</p>
				<h1 className="font-display text-xl sm:text-2xl font-bold text-base-content tracking-tight">
					Swipe to find your next dev match
				</h1>
				<p className="text-xs sm:text-sm text-base-content/60 mt-1.5 font-medium">
					Heart to connect, cross to pass. One card at a time.
				</p>
			</div>
			<UserCard
				user={currentUser}
				key={currentUser._id || currentUser.id || "current-user"}
			/>
		</motion.div>
	);
};

export const Feed = memo(FeedInner);
