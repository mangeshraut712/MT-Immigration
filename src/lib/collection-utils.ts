export function dedupeBy<T, K>(items: T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>()
  const result: T[] = []

  for (const item of items) {
    const key = getKey(item)

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(item)
  }

  return result
}

export function assertUniqueBy<T, K>(
  items: T[],
  label: string,
  getKey: (item: T) => K
): T[] {
  const seen = new Set<K>()

  for (const item of items) {
    const key = getKey(item)

    if (seen.has(key)) {
      throw new Error(`Duplicate ${label}: ${String(key)}`)
    }

    seen.add(key)
  }

  return items
}
