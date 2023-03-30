'use client'

import { EnrichedPlace } from "@/common"
import Editor from "@/components/Editor"
import { ProtectionChips, TypeOfProtecionChips } from "@/components/InformationChip"
import Section from "@/components/Section"
import { EditRounded, MapRounded } from "@mui/icons-material"
import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import { format } from "date-fns"

interface PlaceDetailsViewPrpos {
  place: EnrichedPlace
}

// Formats date to 29-10-1990 format
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return format(date, 'dd/mm/yyyy')
}
const PlaceDetailsView = ({ place }: PlaceDetailsViewPrpos) => {
  const date = place.historicInfo?.constructionDate

  return (
    <div>
      <Section title={place.name} extra={
        <Box sx={{flexDirection: 'row', display: 'flex'}}>
          <Tooltip title="Ver no mapa">
            <IconButton>
              <MapRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton>
              <EditRounded />
            </IconButton>
          </Tooltip>
        </Box>

      }>
        <Typography data-cy="place-description" variant="body2">{place.location.address}</Typography>
        <Typography data-cy="place-description" variant="caption">{formatDate(date)}</Typography>
        <Box>
          {TypeOfProtecionChips[place.patrimonyInfo.typeOfProtection] || null}
          {ProtectionChips[place.patrimonyInfo.protectionName] || null}
        </Box>
        <Typography data-cy="place-description">{place.description}</Typography>
      </Section>
      <Editor/>
    </div>
  )
}

export default PlaceDetailsView
