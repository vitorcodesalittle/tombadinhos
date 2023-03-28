import axios from 'axios'
import { GetPlacesQuery, Place, Page, EnrichedPlace } from '@/common'
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react'


export interface Query {
  q: string
}
export interface PlacesAPI {
  query: Query,
  setQuery: Dispatch<SetStateAction<Query>>,
  getPlaces(query?: GetPlacesQuery): Promise<Page<Place>>
  places: EnrichedPlace[]
  total: number
  isLoading: boolean
}

const defaultQuery: Query = {
  q: ''
}

const defaultState: PlacesAPI = {
  query: defaultQuery,
  isLoading: false,
  total: 0,
  places: [],
  getPlaces: async () => { throw new Error('not implemented') },
  setQuery: () => { throw new Error('not implemented') }
}

const PlacesContext = createContext<PlacesAPI>(defaultState)

const PlacesContextProvider = (props: { children: ReactNode }) => {
  const [query, setQuery] = useState(defaultQuery)
  const [places, setPlaces] = useState<EnrichedPlace[]>([])
  const [total, setTotal] = useState(0);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)

  const getPlaces = useCallback(async (query: GetPlacesQuery): Promise<Page<EnrichedPlace>> => {
    setIsLoadingPlaces(true)
    setQuery({
      q: query.query || ''
    })
    try {
      const res = await client.post<Page<EnrichedPlace>>('/api/places', {
        ...query
      }, {})
      setIsLoadingPlaces(false)
      if (res.status === 200) {
        setPlaces(res.data.data)
        setTotal(res.data.total);
        return res.data
      } else {
        return Promise.reject(res)
      }
    } catch (err) {
      setIsLoadingPlaces(false)
      return Promise.reject(err)
    }
  }, [])
  return (
    <PlacesContext.Provider value={{
      query,
      setQuery,
      total,
      getPlaces,
      places,
      isLoading: isLoadingPlaces
    }}>
      { props.children }
    </PlacesContext.Provider>
  )
}



const client = axios.create({
})

function usePlaces(): PlacesAPI {
  const value = useContext(PlacesContext)
  return value
}



export { PlacesContext, PlacesContextProvider }
export default usePlaces

