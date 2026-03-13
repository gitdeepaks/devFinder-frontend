import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

export const Chat = () => {
	const { targetUserId } = useParams();
	const navigate = useNavigate();
	const user = useSelector((store) => store.user);
	const connections = useSelector((store) => store.connections);
	const userData = user?.data || user;
	const userId = user?._id;

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const socketRef = useRef(null);

	useEffect(() => {
		if (!userId || !targetUserId) return;

		const socket = createSocketConnection();
		socketRef.current = socket;

		socket.emit("joinChat", {
			firstName: userData.firstName,
			lastName: userData.lastName,
			targetUserId,
			userId,
		});

		socket.on("receiveMessage", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socket.off("receiveMessage");
			socket.disconnect();
			socketRef.current = null;
		};
	}, [userId, targetUserId, userData.firstName, userData.lastName]);

	useEffect(() => {
		if (!messagesEndRef.current) return;
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		// We intentionally omit dependencies to run on every render where ref is set.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSend = (e) => {
		e?.preventDefault();
		const text = message.trim();
		if (!text || !socketRef.current || !userId || !targetUserId) return;

		const newMessage = {
			firstName: userData.firstName,
			lastName: userData.lastName,
			id: Date.now(),
			text,
			sender: "me",
			createdAt: new Date().toISOString(),
			fromUserId: userId,
			toUserId: targetUserId,
		};

		socketRef.current.emit("sendMessage", newMessage);

		setMessages((prev) => [...prev, newMessage]);
		setMessage("");
	};

	const targetUser =
		Array.isArray(connections) && targetUserId
			? connections.find((c) => c._id === targetUserId || c.id === targetUserId)
			: null;

	const handleBack = () => {
		navigate(-1);
	};

	const targetUserName = targetUser
		? `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim() ||
			"Developer"
		: null;

	const title = (targetUserName && `Chat with ${targetUserName}`) || "Chat";

	return (
		<div className="max-w-3xl mx-auto h-[calc(100vh-7rem)] px-4 py-4 flex flex-col">
			<header className="flex items-center gap-3 pb-3 border-b border-base-300/60">
				<button
					type="button"
					onClick={handleBack}
					className="btn btn-ghost btn-sm rounded-full px-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.8}
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-5 h-5"
						aria-hidden="true"
					>
						<path d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</button>
				<div className="flex flex-col">
					<h1 className="text-lg font-semibold">{title}</h1>
					{userData && (
						<p className="text-xs text-base-content/60">
							Signed in as {userData.firstName} {userData.lastName}
						</p>
					)}
				</div>
			</header>

			<section className="flex-1 overflow-y-auto py-4 space-y-3">
				{messages.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-center text-base-content/60">
						<div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.6}
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-8 h-8 text-primary/70"
								aria-hidden="true"
							>
								<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5A8.5 8.5 0 0 1 21 11v.5Z" />
							</svg>
						</div>
						<p className="text-sm font-medium">No messages yet</p>
						<p className="text-xs mt-1">
							Start the conversation by sending a message below.
						</p>
					</div>
				) : (
					messages.map((msg) => {
						const isMe = msg.sender === "me";
						return (
							<div
								key={msg.id}
								className={`flex ${isMe ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm ${
										isMe
											? "bg-primary text-primary-content rounded-br-sm"
											: "bg-base-200 text-base-content rounded-bl-sm"
									}`}
								>
									<p>{msg.text}</p>
								</div>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</section>

			<form
				onSubmit={handleSend}
				className="mt-2 pt-2 border-t border-base-300/60 flex items-end gap-2"
			>
				<textarea
					className="textarea textarea-bordered flex-1 rounded-2xl resize-none min-h-12 max-h-28"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={1}
				/>
				<button
					type="submit"
					className="btn btn-primary rounded-2xl px-4"
					disabled={!message.trim()}
					onClick={handleSend}
				>
					Send
				</button>
			</form>
		</div>
	);
};
