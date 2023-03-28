'use client'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { EnrichedPlace } from "@/common";
import { useState } from "react";
import messages from '../../../pt-br'
import { TypeOfProtecionChips, ProtectionChips } from '../../InformationChip'
import ShareModal from "../../ShareModal";
import Link from "next/link";

export interface ResultItemProps {
  place: EnrichedPlace
  onClick?: (place: EnrichedPlace) => void
}

const ResultItem = (props: ResultItemProps) => {
  const { place } = props
  const [visible, setVisible] = useState(false)

  const googleSearch = (term: string) => {
    const googleBaseUrl = 'https://www.google.com/search'
    return `${googleBaseUrl}?q=${encodeURIComponent(term)}`
  }
  return <Card
    data-cy="search-result-item"
    sx={{
      width: '100%', ":hover": {
        boxShadow: 10
      }
    }}
  >
    <CardMedia
      sx={{ height: 140, width: '100%', cursor: 'pointer', }}
      image="/images/building-placeholder.png"
      title={place.name}
      onClick={() => props.onClick && props.onClick(props.place)}
    />
    <CardContent
      sx={{ cursor: 'pointer' }}
      onClick={() => props.onClick && props.onClick(props.place)}
    >
      <Typography gutterBottom variant="h5" component="div">
        {place.name}
      </Typography>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {place.location?.address || ''}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {place.description}
      </Typography>
      {place.patrimonyInfo && <Box>
        {TypeOfProtecionChips[place.patrimonyInfo.typeOfProtection] || null}
        {ProtectionChips[place.patrimonyInfo.protectionName] || null}
      </Box>}
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => setVisible(value => !value)}>{messages.SHARE}</Button>
      <Link href={"/edificios/" + place._id}>
        <Button size="small" >{messages.LEARN_MORE}</Button>
      </Link>
    </CardActions>
    <ShareModal place={place} visible={visible} />
  </Card >
}
export default ResultItem
