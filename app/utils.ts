/**
 * Converts a number of bytes into a human-readable string (KB, MB, GB).
 * @param bytes The number of bytes.
 * @returns A string representing the size in KB, MB, or GB.
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
}

export function createUUID() {
    return crypto.randomUUID();
}