import PlaceDetailsView from "@/components/views/PlaceDetailsView"
import { getPlacesService } from "@/services"

type PageParams = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const PlaceDetails = async ({
  params
}: PageParams) => {
  const place = await getPlacesService().getPlace({ placeId: params.id })

  return (
    <PlaceDetailsView place={place}/>
  )
}
export default PlaceDetails
