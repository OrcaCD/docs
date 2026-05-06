export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
	const res = await fetch(input, init);
	if (!res.ok) {
		throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
	}
	return (await res.json()) as JSON;
}

export function getFallbackData(key: string) {
	const cached = localStorage.getItem(key);
	if (cached) {
		return JSON.parse(cached);
	}
	return null;
}
