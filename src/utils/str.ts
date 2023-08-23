export const list = (text: string, sep = '') => (text || '').split(sep)

export const clean = (text: string) => (text || '').trim().replace(/\s+/g, ' ')

export const choice = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)]
