'use client'
import { themeOptions } from "@/theme"
import { ThemeProvider, createTheme } from "@mui/material"
import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}
const ClientLayout = ({ children }: ClientLayoutProps) => {
  return <ThemeProvider theme={createTheme(themeOptions)}>
    {children}
  </ThemeProvider>
}

export default ClientLayout
