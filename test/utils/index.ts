import { mockPlace, randomInRange, randomString } from "@/common/util";
import { GoogleStatus, IGooglePlacesApi, PlacesCandidate, PlacesFindPlaceFromTextResponse } from "@/google/placesApi";
import { getEsConfig, PlacesDbElastic } from "@/places/places-db-elastic";
import { PlacesService } from "@/places/places-service";
import { ApiConfig, config, } from "@/config";
import { Client, ClientOptions } from "@elastic/elasticsearch";


export const mockLatLon = () => ({
  lat: randomInRange(-6, -9),
  lon: randomInRange(-30, 39)
})
export const mockLatLng = () => ({
  lat: randomInRange(-9, -6),
  lng: randomInRange(-30, 39)
})
export const mockGoogleBasicInfo = (name: string): PlacesCandidate => ({
  icon: '...',
  name,
  types: [],
  photos: [],
  place_id: randomString(),
  formatted_address: '...',
  icon_mask_base_uri: '...',
  icon_background_color: '#ef1a31',
  geometry: {
    location: mockLatLng(),
    viewport: {
      northeast: mockLatLng(),
      southwest: mockLatLng()
    }
  }
})

export const mockEnrichedPlace = () => {
  const mock = mockPlace()
  const googleBasicInfo = mockGoogleBasicInfo(mock.name)
  return {
    ...mock,
    googleBasicInfo
  }
}
export const deleteAll = (index: string, customConfig?: ClientOptions) => {
  const options = customConfig || getEsConfig(config)
  const client = new Client(options)
  return client.deleteByQuery({
    query: {
      match_all: {}
    },
    refresh: true,
    index,
  })
}

export class MockGooglePlacesApi implements IGooglePlacesApi {
  async findPlace(): Promise<PlacesFindPlaceFromTextResponse> {
    return {
      status: GoogleStatus.OK,
      candidates: [mockGoogleBasicInfo(randomString())],
      error_message: '',
      info_messages: []
    }
  }
}

// Builds a PlaceService with mocked google api and returns it
export const makePlaceService = async (config: ApiConfig) => {
  const placesDb = new PlacesDbElastic(getEsConfig(config))
  await placesDb.setupIndexes()
  const googlePlacesService = new MockGooglePlacesApi()
  return new PlacesService(placesDb, googlePlacesService)
}
