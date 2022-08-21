export const zip = (arr: unknown[][]) => {
  return arr.reduce<unknown[][]>(
    // eslint-disable-next-line no-sequences
    (acc, curr) => (curr.forEach((v: unknown, k: number) => acc[k].push(v)), acc),
    Array.from({ length: Math.max(...arr.map(v => v.length)) }).map(() => [])
  )
}
