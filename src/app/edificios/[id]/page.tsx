import PlaceDetailsView from "@/components/views/PlaceDetailsView"
import { placesService } from "services"

type PageParams = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const PlaceDetails = async ({
  params
}: PageParams) => {
  const place = await placesService().getPlace({ placeId: params.id })

  return (
    <PlaceDetailsView place={place}/>
  )
}
export default PlaceDetails
