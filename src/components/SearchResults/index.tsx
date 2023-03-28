'use client'
import { List, ListItem, Typography } from '@mui/material'
import ResultItem from './ResultItem'
import messages from '../../pt-br'
import { EnrichedPlace } from '@/common'
import { useTheme } from '@emotion/react'

export interface SearchResultsProps {
  isLoading?: boolean
  places: EnrichedPlace[]
  total: number
}

const SearchResults = (props: SearchResultsProps) => {
  const theme = useTheme()
  return (
    <>
      <Typography color="white" ml={4}>{messages.TOTAL}: {props.total}</Typography>
      <List sx={{ width: '100%' }} data-cy="search-result"> {props.places.map(place => (
          <ListItem key={place._id}>
            <ResultItem place={place} />
          </ListItem>
        ))}
      </List>
    </>
  )

}

export default SearchResults
