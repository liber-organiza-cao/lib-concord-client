import { ed25519 } from '@noble/curves/ed25519.js';
import * as bip39 from "@scure/bip39";
import { wordlist as englishWordlist } from "@scure/bip39/wordlists/english.js";

export interface Autenticator {
    sign(data: Uint8Array): Uint8Array;
    verify(data: Uint8Array, signature: Uint8Array): boolean;
    publicKey(): Uint8Array;
}

export function defaultAutenticator(privateKey: Uint8Array): Autenticator {
    const publicKey = ed25519.getPublicKey(privateKey);

    return {
        sign(data: Uint8Array): Uint8Array {
            return ed25519.sign(data, privateKey);
        },
        verify(data: Uint8Array, signature: Uint8Array): boolean {
            return ed25519.verify(signature, data, publicKey);
        },
        publicKey(): Uint8Array {
            return publicKey;
        }
    };
}


export function keygen(seed?: Uint8Array): { privateKey: Uint8Array; publicKey: Uint8Array } {
    const { publicKey, secretKey: privateKey } = ed25519.keygen(seed);
    return { privateKey, publicKey };
}

export async function mnemonicToSeed(mnemonic: string[], passphrase?: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic.join(" "), passphrase);
    return seed.slice(0, 32);
}

export function generateMnemonic(wordlist: string[] = englishWordlist, strength: number = 128): string[] {
    return bip39.generateMnemonic(wordlist, strength).split(" ");
}