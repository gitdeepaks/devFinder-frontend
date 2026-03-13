import { io } from "socket.io-client";
import { BASE_URL, SITE_URL } from "./contstants";
export const createSocketConnection = () => {
	return io(SITE_URL || BASE_URL);
};
