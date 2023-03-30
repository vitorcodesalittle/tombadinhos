'use client';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material'


const HomeView = () => {
  const theme = useTheme()

  return (
    <Box sx={{ borderRadius: 4, maxWidth: 600, margin: 10, padding: 5, backgroundColor: theme.palette.primary.dark }} component={Card}>
      <Typography sx={{ ...theme.typography?.h3 }}>
        Catálogo de Edifícios Tombados
      </Typography>
      <Typography sx={{ ...theme.typography.body1 }}>
        Somos um grupo de pessoas interessadas em preservação do patrimônio público.
      </Typography>
      <Typography sx={{ ...theme.typography.body1 }}>
        Criamos esse site para ter uma forma <strong>centralizada</strong> de ver os prédios tombados na proximidade.
      </Typography>
    </Box>
  )
}


export default HomeView
