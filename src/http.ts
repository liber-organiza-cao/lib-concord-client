export interface Channel {
    id: string,
    name: string,
}

export interface GetInfoResponse {
    title: string,
    channels: Channel[],
}

export async function getInfo(url: string): Promise<GetInfoResponse> {
    const response = await fetch(`${url}/info`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return response.json();
}
