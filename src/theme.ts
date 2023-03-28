'use client'
import { ThemeOptions, ThemeProvider } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c2cde',
    },
    secondary: {
      main: '#ee6c9f',
      contrastText: '#ffffff',
    },
  },
};
export { ThemeProvider }
