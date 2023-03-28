import {EnrichedPlace, GetPlacesQuery, Page} from "@/common";
import {GoogleStatus, IGooglePlacesApi} from "@/google/placesApi";
import { PlaceServicepError } from "./errors";
import {IPlaceService, IPlacesDB} from "./types";


export class GooglePlacesApiError extends Error {

  constructor (message: string) {

    super(message);

  }

}

export class PlacesService implements IPlaceService {

  private placesDb: IPlacesDB;

  private googlePlacesApi: IGooglePlacesApi;

  constructor (placesDb: IPlacesDB, googlePlacesApi: IGooglePlacesApi) {

    this.placesDb = placesDb;
    this.googlePlacesApi = googlePlacesApi;

  }
  async getPlace(query: { placeId: string; }): Promise<EnrichedPlace> {
    const result = await this.placesDb.getPlaceById(query.placeId)
    if (!result) throw new Error(PlaceServicepError.PlaceNotFound)
    return result
  }

  async searchPlaces (query?: GetPlacesQuery | undefined): Promise<Page<EnrichedPlace>> {

    const page = query?.page || 0,
      perPage = query?.perPage || 50,
      lat = query?.location?.lat || 30,
      lon = query?.location?.lon || 30,
      q = query?.query || "",
      data = await this.placesDb.getPlaces({
        lat,
        lon,
        "query": q,
        "skip": page * perPage,
        "limit": perPage
      }),
      total = await this.placesDb.count({
        "query": q,
        lat,
        lon
      });
    return {data,
      total};
  }

  async createPlace (info: Omit<EnrichedPlace, "_id" | "googleBasicInfo">): Promise<void> {

    const res = await this.googlePlacesApi.findPlace({
      "input": info.name
    });
    if (res.status === GoogleStatus.OK) {

      const googleBasicInfo = res.candidates[0],
        enrichedPlace: Omit<EnrichedPlace, "_id"> = {
          ...info,
          googleBasicInfo,
          "location": {
            ...info.location || {},
            "lat": googleBasicInfo.geometry.location.lat,
            "lon": googleBasicInfo.geometry.location.lng
          }
        },
        result = await this.placesDb.writePlace(
          enrichedPlace,
          true
        );
      console.info(
        "[Places Service] Indexed a new place:",
        result
      );

    } else {

      console.error(res);
      throw new GooglePlacesApiError("Failed to use google findPlace");

    }

  }

}


