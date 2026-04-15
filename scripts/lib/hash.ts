import { createHash } from 'node:crypto';

export function contentHash(...parts: string[]): string {
	const joined = parts.join('\n--\n');
	return createHash('sha256').update(joined).digest('hex');
}
