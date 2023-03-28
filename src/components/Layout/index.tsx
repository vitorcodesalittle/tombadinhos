'use client'
import Box from '@mui/system/Box'
import { FC, ReactNode } from 'react'


const Layout: FC<{children?: ReactNode}> = (props) => {
  return <Box sx={{
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    {props.children || null}
  </Box>
}

export default Layout
