import { useEffect, useState } from "react";

const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000;

type LocalStorageCache<JSON> = {
	value: JSON | null;
	expiresAt: number;
};

type FallbackDataState<JSON> = {
	data: JSON | null;
	hasFreshData: boolean;
};

function isLocalStorageCache<JSON>(value: unknown): value is LocalStorageCache<JSON> {
	if (!value || typeof value !== "object") {
		return false;
	}

	if (!("value" in value) || !("expiresAt" in value)) {
		return false;
	}

	return typeof (value as { expiresAt: unknown }).expiresAt === "number";
}

function readFallbackData<JSON>(key: string): FallbackDataState<JSON> {
	if (typeof window === "undefined") {
		return {
			data: null,
			hasFreshData: false,
		};
	}

	const cached = localStorage.getItem(key);
	if (!cached) {
		return {
			data: null,
			hasFreshData: false,
		};
	}

	try {
		const parsed = JSON.parse(cached) as unknown;

		if (isLocalStorageCache<JSON>(parsed)) {
			return {
				data: parsed.value,
				hasFreshData: parsed.expiresAt > Date.now(),
			};
		}

		// Backward compatibility for old cache entries without metadata.
		return {
			data: parsed as JSON,
			hasFreshData: false,
		};
	} catch {
		return {
			data: null,
			hasFreshData: false,
		};
	}
}

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
	const res = await fetch(input, init);
	if (!res.ok) {
		throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
	}
	return (await res.json()) as JSON;
}

export function useFallbackData<JSON = any>(key: string, ttlMs = DEFAULT_CACHE_TTL_MS) {
	const [fallbackData, setFallbackData] = useState<FallbackDataState<JSON>>(() =>
		readFallbackData<JSON>(key),
	);

	const setCacheEntry = (data: JSON | null) => {
		if (typeof window === "undefined") {
			return;
		}

		const cachePayload: LocalStorageCache<JSON> = {
			value: data,
			expiresAt: Date.now() + ttlMs,
		};

		localStorage.setItem(key, JSON.stringify(cachePayload));
		setFallbackData({
			data,
			hasFreshData: true,
		});
	};

	useEffect(() => {
		setFallbackData(readFallbackData<JSON>(key));

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				setFallbackData(readFallbackData<JSON>(key));
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key]);

	return {
		data: fallbackData.data,
		hasFreshData: fallbackData.hasFreshData,
		setCachedData: setCacheEntry,
		markCacheWindow: () => setCacheEntry(fallbackData.data),
	};
}
