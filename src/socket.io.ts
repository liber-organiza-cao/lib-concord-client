import { io, Socket } from "socket.io-client";

export interface Message {
    id: string,
    content: string,
}

export interface ServerToClientEvents {
    messageReceived: (message: Message) => void,
}

export interface ClientToServerEvents {
    joinChannel: (channelId: string, callback: (success: boolean) => void) => void,
    sendMessage: (message: string) => void,
    loadMessages: (beforeId?: string, callback?: (messages: Message[]) => void) => void,

    createChannel: (name: string, callback: (success: boolean) => void) => void,
    deleteChannel: (channelId: string, callback: (success: boolean) => void) => void,

    requestAuthChallenge: (publicKey: number[], callback: (secret: number[]) => void) => void,
    confirmAuthChallenge: (signature: number[], callback: (success: boolean, isAdmin: boolean) => void) => void,
}

export type SocketIoConnection = Socket<ServerToClientEvents, ClientToServerEvents>;

export function IO(url: string, authToken: string): SocketIoConnection {
    return io(url, { auth: { token: authToken } });
}