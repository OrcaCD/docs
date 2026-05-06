import { useEffect, useState } from "react";

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
	const res = await fetch(input, init);
	if (!res.ok) {
		throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
	}
	return (await res.json()) as JSON;
}

export function useFallbackData<JSON = any>(key: string) {
	const [fallbackData, setFallbackData] = useState<JSON | null>(null);

	useEffect(() => {
		const cached = localStorage.getItem(key);
		if (cached) {
			setFallbackData(JSON.parse(cached));
		}

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				if (event.newValue) {
					setFallbackData(JSON.parse(event.newValue));
				} else {
					setFallbackData(null);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key]);

	return fallbackData;
}
