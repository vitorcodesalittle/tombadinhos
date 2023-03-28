import SearchInput from "../../components/SearchInput"
import SearchResults from "../../components/SearchResults"
import SearchPlacesView from "@/components/views/SearchPlaceView"
import { PlacesService } from "@/places/places-service"
import { PlacesDbElastic } from "@/places/places-db-elastic"
import { GooglePlacesApi } from "@/google/placesApi"
import { getEsConfig } from "@/places/places-db-elastic"
import { config } from "@/config"


const SearchPlaces = async () => {
  const placesDb = new PlacesDbElastic(getEsConfig(config));
  const googlePlaces = new GooglePlacesApi(config.googleApiKey)
  const placesServices = new PlacesService(placesDb, googlePlaces)
  const places = await placesServices.searchPlaces({
  })
  return (
    <SearchPlacesView places={places.data} results={<SearchResults places={places.data} total={places.total} />}>
      <SearchInput query={''} />
    </SearchPlacesView>)
}


export default SearchPlaces
