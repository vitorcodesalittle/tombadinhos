'use client'
import { Box, Card, CardContent, Typography } from "@mui/material"
import { ReactNode } from "react"

export interface SectionProps {
  title: string
  extra?: ReactNode
  children: ReactNode
}

const Section = (props: SectionProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
      <Card sx={{
        flex: 1,
        maxWidth: 600
      }}>
        <CardContent>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Typography data-cy="place-title" variant="h6" flexGrow={1}>{props.title}</Typography>
            {props.extra && <Box sx={{flex: '0 1', justifySelf: 'flex-end'}}>
              {props.extra}
            </Box>}
          </Box>
          {props.children}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Section
