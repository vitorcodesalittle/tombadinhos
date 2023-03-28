'use client'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Stack, Box } from '@mui/system'
import { useState } from 'react'
import messages from '../../pt-br'
import { Query } from '@/hooks/usePlaces'
import { Link } from '@mui/material'

export interface SearchInputProps {
  onSearch?: (query: Query) => void
  query?: string
}
/**
 * Component to search places.
 *
 * TODO: add inputs for other queries
 */
const SearchInput = ({ onSearch, query }: SearchInputProps) => {
  const [q, setQ] = useState(query || '')
  const handleSearch = () => onSearch && onSearch({ q })
  return <Stack>
    <TextField id="search" inputProps={{ suppressHydrationWarning: true }} onKeyDown={(event) => {
      if (event.key === 'Enter') {
        handleSearch()
      }
    }} sx={{
      mb: 3,
    }}
    placeholder={messages['HOME:SEARCH_PLACEHOLDER']}
    value={q} onChange={event => {setQ(event.target.value); console.log(event.target.value, q)}} />
    <Box sx={{ justifyContent: 'flex-start', display: 'flex' }}>
      <Link href={"/search?q=" + encodeURI(q || '')}>
        <Button data-cy="search-button" variant="contained">{messages['SEARCH']}</Button>
      </Link>
    </Box>
  </Stack>
}
export default SearchInput
