export interface GetInfoResponse {
    title: string,
    public_key: string
}

export async function getInfo(url: string): Promise<GetInfoResponse> {
    const response = await fetch(`${url}/info`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return response.json();
}
