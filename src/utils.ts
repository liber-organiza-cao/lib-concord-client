export type Result<T, E> = Ok<T> | Err<E>;
export type Ok<T> = [true, T];
export type Err<E> = [false, E];

export function ok<T>(value: T): Ok<T> {
    return [
        true,
        value
    ] as const;
}

export function err<E>(value: E): Err<E> {
    return [
        false,
        value
    ] as const;
}

export function parseErr<T, E>(fn: (...args: any[]) => T, ...args: any[]): Result<T, E>;
export function parseErr<T, E>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<Result<T, E>>;

export function parseErr<T, E>(fn: (...args: any[]) => T | Promise<T>, ...args: any[]): Result<T, E> | Promise<Result<T, E>> {
    try {
        const result = fn(...args);

        if (result instanceof Promise) {
            return result
                .then(value => ok<T>(value))
                .catch(error => err<E>(error));
        }

        return ok<T>(result);
    } catch (error) {
        return err<E>(error as E);
    }
}


export function parse<T>(input: any): T | undefined {
    const data = String(input);
    const [ok, value] = parseErr<T, any>(JSON.parse, data);
    if (ok) {
        return value;
    } else {
        return undefined;
    }
}

export async function fetch(input: URL | Request | string, init?: RequestInit): Promise<Result<Response, any>> {
    return await parseErr<Response, any>(window.fetch, input, init);
}
