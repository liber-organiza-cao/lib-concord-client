
import { SocketIoConnection, IO, Message } from "./socket.io.js";
import { challengeConfirm, challengeRequest } from "./http.js";
import { type Autenticator } from "./autenticator.js";
import { err, ok, Result } from "./utils.js";
import * as sha from '@noble/hashes/sha2.js';

export class Client {
    socketIo: SocketIoConnection;
    _publicKey: Uint8Array;
    _isAdmin: boolean = false;
    _currentChannel: string | null = null;

    on: typeof this.socketIo.on;
    emit: typeof this.socketIo.emit;
    disconnect: typeof this.socketIo.disconnect;

    constructor(url: string, authToken: string, publicKey: Uint8Array, isAdmin: boolean = false) {
        this.socketIo = IO(url, authToken);
        this._publicKey = publicKey;
        this._isAdmin = isAdmin;
        this.on = this.socketIo.on.bind(this.socketIo);
        this.emit = this.socketIo.emit.bind(this.socketIo);
        this.disconnect = this.socketIo.disconnect.bind(this.socketIo);
    }

    static async init(url: string, authenticator: Autenticator): Promise<Result<Client, any>> {
        const publicKey = authenticator.publicKey();
        const [okay, challenge] = await challengeRequest(url, publicKey);

        if (!okay) {
            return err(challenge);
        } else {
            const { token } = challenge;
            const hash = sha.sha256(new TextEncoder().encode(token));
            const signature = authenticator.sign(hash);
            const [okay, auth] = await challengeConfirm(url, token, signature);

            if (!okay) {
                return err(auth);
            } else {
                const { token, payload } = auth

                const client = new Client(url, token, publicKey, payload.is_admin);

                return ok(client);
            }
        }
    }

    async joinChannel(id: string): Promise<Result<void, void>> {
        return new Promise((resolve) => {
            this.emit("joinChannel", id, (success) => {
                if (success) {
                    this._currentChannel = id;
                    resolve(ok(void 0));
                } else {
                    this._currentChannel = null;
                    resolve(err(void 0));
                }
            });
        });
    }

    async loadMessages(beforeId?: string): Promise<Message[]> {
        return new Promise((resolve) => {
            this.emit("loadMessages", beforeId, (messages) => {
                resolve(messages);
            });
        });
    }

    sendMessage(message: string): Result<void, void> {
        if (!this._currentChannel) {
            return err(void 0);
        }
        this.emit("sendMessage", message);
        return ok(void 0);

    }

    isConnected(): boolean {
        return this.socketIo.connected;
    }

    isAdmin(): boolean {
        return this._isAdmin;
    }

    publicKey(): Uint8Array {
        return this._publicKey!;
    }

    currentChannel(): string | null {
        return this._currentChannel;
    }
}