export function matchesAny(name: string, patterns: string[]): boolean {
	for (const pattern of patterns) {
		if (pattern.includes('*')) {
			const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
			const re = new RegExp(`^${escaped}$`);
			if (re.test(name)) return true;
		} else if (pattern === name) {
			return true;
		}
	}
	return false;
}
