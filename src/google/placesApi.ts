import axios, { AxiosInstance } from "axios"
/**
  * Google maps API
*
  * Needed APIs:
  * - Places - FindPlace (limit to 8000 requests per month, cache everything)
  * - Maps - Maps Emped API
  *
  *
  * Places API docs
  * https://developers.google.com/maps/documentation/places/web-service/overview?hl=pt-br
  */

interface PlacesLocation {
  lat: number,
  lng: number
}

interface PlacesGeometry {
  location: PlacesLocation,
  viewport: {
    northeast: PlacesLocation,
    southwest: PlacesLocation
  }
}
export interface PlacesPhoto {
  height: number
  width: number
  html_attributions: string[]
  photo_reference: string
}
export interface PlacesCandidate {
  formatted_address: string
  geometry: PlacesGeometry,
  icon: string,
  icon_background_color: string,
  icon_mask_base_uri: string,
  name: string,
  photos: PlacesPhoto[],
  place_id: string,
  // See docs for options:
  // https://developers.google.com/maps/documentation/places/web-service/supported_types#table2
  types: string[]
}

export enum GoogleStatus {
  OK = 'OK',
  ZERO_RESULTS = 'ZERO_RESULTS',
  INVALID_REQUEST = 'INVALID_REQUEST',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface PlacesFindPlaceFromTextResponse {
  candidates: PlacesCandidate[],
  status: GoogleStatus, 
  error_message: string,
  info_messages: string[]
}

export interface PlacesFindPlaceFromTextQuery {
  // The search query
  input: string
  // If the input is a text or a phone number
  inputType?: 'textquery' | 'phonenumber',
  // Bias to apply in search, see format in docs https://developers.google.com/maps/documentation/places/web-service/search-find-place#locationbias
  locationBias?: string
  // Fields to add to places, By default adds all basic fields.
  // Fields that are not basic cost more. Don't use
  fields?: string[]
}

export interface IGooglePlacesApi {
  /**
    * Find Place documentation
    * https://developers.google.com/maps/documentation/places/web-service/search-find-place?hl=pt-br#maps_http_places_findplacefromtext_mca-js
    */
  findPlace(query: PlacesFindPlaceFromTextQuery): Promise<PlacesFindPlaceFromTextResponse>
}


const BASIC_FIELDS = ['business_status', 'formatted_address', 'geometry', 'icon', 'icon_mask_base_uri', 'icon_background_color', 'name', 'photo', 'place_id', 'plus_code', 'type']
const marcoZero30Km = 'circle:30000@-8,-34'

export class GooglePlacesApi implements IGooglePlacesApi {
  private client: AxiosInstance = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api',
    headers: {
      'Accept-Language': 'pt-BR'
    }
  })
  private googleApiKey: string;
  constructor(googleApiKey: string) {
    this.googleApiKey = googleApiKey

  }
  async findPlace(query: PlacesFindPlaceFromTextQuery): Promise<PlacesFindPlaceFromTextResponse> {
    const res = await this.client.get<PlacesFindPlaceFromTextResponse>("place/findplacefromtext/json", {
      params: {
        input: query.input,
        inputtype: query.inputType || 'textquery',
        key: this.googleApiKey,
        fields: (query.fields || BASIC_FIELDS).join(','),
        locationbias: (query.locationBias || marcoZero30Km)
      }
    })
    return res.data
  }
}


