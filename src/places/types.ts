import {IndexResponse} from "@elastic/elasticsearch/lib/api/types";
import {GetPlacesDbQuery, GetPlacesQuery, Page, Place, EnrichedPlace} from "@/common";


export interface IPlacesDB {
  getPlaceById(placeId: string): Promise<EnrichedPlace | undefined>;
  getPlaces(query: GetPlacesDbQuery): Promise<EnrichedPlace[]>
  count(query: Omit<GetPlacesDbQuery, "page"|"perPage">): Promise<number>
  writePlace(info: Omit<EnrichedPlace, "_id">, refresh?: boolean): Promise<IndexResponse>
}

export interface IPlaceService {
  getPlace(arg0: { placeId: string ; }): Promise<EnrichedPlace>;
  searchPlaces(query?: GetPlacesQuery): Promise<Page<EnrichedPlace>>
  createPlace(info: Omit<Place, "id">): Promise<void>
}

