import { Result, err, fetch, ok } from "./utils.js";

export interface Channel {
    id: string,
    name: string,
}

export interface GetInfoResponse {
    title: string,
    channels: Channel[],
}

export interface ResponseAuthChallenge {
    token: string,
}

export interface ResponseConfirmAuthChallenge {
    token: string,
    payload: AuthenticatedPayload,
}

export interface AuthenticatedPayload {
    public_key: string,
    is_admin: boolean,
    exp: number,
}

export async function getInfo(url: string): Promise<Result<GetInfoResponse, any>> {
    const [okay, value] = await fetch(`${url}/info`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (okay && value.ok) {
        return ok(await value.json());
    } else {
        return err(value);
    }
}

export async function challengeRequest(url: string, publicKey: Uint8Array): Promise<Result<ResponseAuthChallenge, any>> {
    const [okay, value] = await fetch(`${url}/auth/challenge/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            public_key: Array.from(publicKey),

        }),
    });
    if (okay && value.ok) {
        return ok(await value.json());
    } else {
        return err(value);
    }
}

export async function challengeConfirm(url: string, token: string, signature: Uint8Array): Promise<Result<ResponseConfirmAuthChallenge, any>> {
    const [okay, value] = await fetch(`${url}/auth/challenge/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token,
            signature: Array.from(signature)
        }),
    });
    if (okay && value.ok) {
        return ok(await value.json());
    } else {
        return err(value);
    }
}