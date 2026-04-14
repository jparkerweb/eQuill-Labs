export function sortKeysDeep<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map((item) => sortKeysDeep(item)) as unknown as T;
	}
	if (obj !== null && typeof obj === 'object') {
		const sorted: Record<string, unknown> = {};
		for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
			sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
		}
		return sorted as T;
	}
	return obj;
}

export function stableStringify(obj: unknown, indent = 2): string {
	return JSON.stringify(sortKeysDeep(obj), null, indent);
}
