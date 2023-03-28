import PlaceDetailsView from "@/components/views/PlaceDetailsView"
import { config } from "@/config"
import { GooglePlacesApi } from "@/google/placesApi"
import { PlacesDbElastic, getEsConfig } from "@/places/places-db-elastic"
import { PlacesService } from "@/places/places-service"

type PageParams = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const PlaceDetails = async ({
  params
}: PageParams) => {
  const id = params.id
  const db = new PlacesDbElastic(getEsConfig(config));
  const googlePlacesApi = new GooglePlacesApi(config.googleApiKey)
  const placesServices = new PlacesService(db, googlePlacesApi);
  const place = await placesServices.getPlace({ placeId: id })

  return (
    <PlaceDetailsView place={place}/>
  )
}
export default PlaceDetails
