export function invariant(
    condition: unknown,
    message = 'Invariant violation',
): asserts condition {
    if (!condition) {
        throw new Error(message)
    }
}

export function assertUnreachable(value: never, message?: string): never {
    throw new Error(message ?? `Unexpected value: ${String(value)}`)
}
