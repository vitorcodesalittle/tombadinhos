import { Place, TypeOfProtection } from "./index"

export const range = (total: number) => {
  return new Array(total).fill(0).map(() => 0)
}

export const randomInRange = (low: number, high: number) => Math.min(low, high) + Math.random() * Math.abs(high - low)
export const randomChar = () => String.fromCharCode(Math.floor(Math.random() * 20) + 'a'.charCodeAt(0))
export const randomString = () => range(10).map(() => randomChar()).join('')
export const randomDate = () => new Date()
export const pickRandom = <T,>(array: T[]): T => {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}
export const PROTECTION_TYPES: TypeOfProtection[] = [
  'district',
  'state',
  'national',
  'humanity'
]

export const mockLocation = () => ({
  lat: randomInRange(-9, -8),
  lon: randomInRange(-32, -31)
})
export const mockPlace = (): Omit<Place, '_id'> => {
  return {
    location: mockLocation(),
    name: randomString(),
    patrimonyInfo: {
      typeOfProtection: pickRandom(PROTECTION_TYPES),
      protectedSince: randomDate(),
      protectionName: 'IEP',
    },
    _resourceUrl: "https://google.com",
    description: randomString(),
    historicInfo: {
      constructionDate: randomDate()
    }
  }
}


