import { getPlacesService } from "@/services"
import SearchInput from "../../components/SearchInput"
import SearchResults from "../../components/SearchResults"
import SearchPlacesView from "@/components/views/SearchPlaceView"


const SearchPlaces = async () => {
  const places = await getPlacesService().searchPlaces({
  })
  return (
    <SearchPlacesView places={places.data} results={<SearchResults places={places.data} total={places.total} />}>
      <SearchInput query={''} />
    </SearchPlacesView>)
}


export default SearchPlaces
