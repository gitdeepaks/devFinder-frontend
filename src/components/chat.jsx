import { toast } from "@pheralb/toast";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/contstants";
import { createSocketConnection } from "../utils/socket";

export const Chat = () => {
	const { targetUserId } = useParams();
	const navigate = useNavigate();
	const user = useSelector((store) => store.user);
	const connections = useSelector((store) => store.connections);
	const userData = user?.data || user;
	const userId = userData?._id;

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const socketRef = useRef(null);

	const fetchChat = useCallback(async () => {
		if (!userId || !targetUserId) return;

		if (!BASE_URL) {
			console.error("BASE_URL is not configured for chat API.");
			toast.error({
				text: "Chat unavailable",
				description: "API base URL is not configured.",
			});
			return;
		}

		try {
			const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
				withCredentials: true,
			});
			const chat = response.data;
			const rawMessages = Array.isArray(chat?.messages) ? chat.messages : [];

			const chatMessages = rawMessages.map((message) => {
				const senderUser = message?.content;
				const senderId = senderUser?._id || senderUser?.id;
				const isMe = senderId && senderId === userId;

				return {
					firstName: senderUser?.firstName,
					lastName: senderUser?.lastName,
					id: message?._id || message?.id,
					text: message?.text,
					sender: isMe ? "me" : "them",
					createdAt: message?.createdAt,
					fromUserId: senderId,
					toUserId: isMe ? targetUserId : userId,
				};
			});

			setMessages(chatMessages);
		} catch (error) {
			console.error("Error fetching chat:", error);
			toast.error({
				text: "Error fetching chat",
				description: error.response?.data?.message || "Please try again later.",
			});
		}
	}, [userId, targetUserId]);

	useEffect(() => {
		fetchChat();
	}, [fetchChat]);

	useEffect(() => {
		if (!userId || !targetUserId || !userData) return;

		const socket = createSocketConnection();
		socketRef.current = socket;

		if (userData) {
			socket.emit("joinChat", {
				firstName: userData.firstName,
				lastName: userData.lastName,
				targetUserId,
				userId,
			});
		}

		socket.on("receiveMessage", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socket.off("receiveMessage");
			socket.disconnect();
			socketRef.current = null;
		};
	}, [userId, targetUserId, userData]);

	useEffect(() => {
		if (!messagesEndRef.current) return;
		messagesEndRef.current.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, []);

	const handleSend = (e) => {
		e?.preventDefault();
		const text = message.trim();
		if (!text || !socketRef.current || !userId || !targetUserId || !userData)
			return;

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

	const targetUser = useMemo(
		() =>
			Array.isArray(connections) && targetUserId
				? connections.find(
						(c) => c._id === targetUserId || c.id === targetUserId,
					)
				: null,
		[connections, targetUserId],
	);

	const handleBack = () => {
		navigate(-1);
	};

	const targetUserName = useMemo(
		() =>
			targetUser
				? `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim() ||
					"Developer"
				: null,
		[targetUser],
	);

	const title = useMemo(
		() => (targetUserName && `Chat with ${targetUserName}`) || "Chat",
		[targetUserName],
	);

	const formatTime = (iso) => {
		if (!iso) return "";
		const d = new Date(iso);
		return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className="max-w-3xl mx-auto h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] px-3 sm:px-4 py-3 sm:py-4 flex flex-col rounded-3xl bg-base-100/95 shadow-xl border border-base-300/70 backdrop-blur">
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
					<h1 className="text-lg font-semibold tracking-tight">{title}</h1>
					{userData && (
						<p className="text-xs text-base-content/60">
							Signed in as {userData.firstName} {userData.lastName}
						</p>
					)}
				</div>
			</header>

			<section className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin scrollbar-thumb-base-300/80 scrollbar-track-transparent">
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
						const timeLabel = formatTime(msg.createdAt);
						return (
							<div
								key={msg.id}
								className={`flex items-end gap-2 ${
									isMe ? "justify-end" : "justify-start"
								}`}
							>
								{!isMe && (
									<div className="avatar placeholder w-7 h-7">
										<div className="bg-base-200 rounded-full text-xs flex items-center justify-center">
											<span>
												{(msg.firstName?.[0] || "").toUpperCase()}
												{(msg.lastName?.[0] || "").toUpperCase()}
											</span>
										</div>
									</div>
								)}
								<div
									className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow-sm ${
										isMe
											? "bg-primary text-primary-content rounded-br-sm"
											: "bg-base-200 text-base-content rounded-bl-sm"
									}`}
								>
									<p className="whitespace-pre-wrap leading-snug">{msg.text}</p>
									{timeLabel && (
										<p className="mt-1 text-[10px] opacity-70 text-right">
											{timeLabel}
										</p>
									)}
								</div>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</section>

			<form
				onSubmit={handleSend}
				className="mt-2 pt-3 border-t border-base-300/60 flex items-end gap-3"
			>
				<textarea
					className="textarea textarea-bordered flex-1 rounded-2xl resize-none min-h-12 max-h-28 bg-base-200/60 focus:bg-base-100 transition-colors text-sm"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend(e);
						}
					}}
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
