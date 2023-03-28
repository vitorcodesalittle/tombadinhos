import { config } from "@/config";
import { GooglePlacesApi } from "@/google/placesApi";
import { PlacesDbElastic, getEsConfig } from "@/places/places-db-elastic";
import { PlacesService } from "@/places/places-service";
import { IPlaceService } from "@/places/types";


export const placesService = (): IPlaceService => {
  const placesDb = new PlacesDbElastic(getEsConfig(config));
  const googlePlaces = new GooglePlacesApi(config.googleApiKey)
  const service= new PlacesService(placesDb, googlePlaces)
  return service
}
