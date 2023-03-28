import { PlacesCandidate } from "../google/placesApi"

/**
  * Where to find something.
  */
export interface Location {
  lat: number
  lon: number
  address?: string
}

/**
  * History meaningful information of some patrimony
  */
export interface HistoricInfo {
  constructionDate?: string,
}


/* 
  *
  * Level of legal protection the patrimony has
  * Example: Buliding ____ has "district" level of legal protection because it's
  * protected by a district law that classifies it as a Imóvel Especial de
  * Preservação
  */
export type TypeOfProtection = "district" | "state" | "national" | "humanity"
export type ProtectionName = "IEP"

export interface PatrimonyInfo {
  protectedSince?: Date
  typeOfProtection: TypeOfProtection
  protectionName: ProtectionName 
}

export interface Place {
  _id: string  
  name: string
  description: string
  location: Location
  historicInfo?: HistoricInfo
  patrimonyInfo: PatrimonyInfo
  iepCode?: number
  _resourceUrl: string
}

export type Page<T> = {
  data: T[],
  total: number
}

export interface GetPlacesQuery {
  location?: {
    lat: number,
    lon: number,
  },
  query?: string,
  perPage?: number
  page?: number
}


export interface GetPlacesDbQuery {
  lat: number,
  lon: number,
  typeOfProtection?: TypeOfProtection[],
  limit?: number,
  skip?: number
  query?: string
}

export type EnrichedPlace = Place & { googleBasicInfo: PlacesCandidate }
