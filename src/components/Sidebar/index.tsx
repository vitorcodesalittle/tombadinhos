'use client'

import { Drawer, MenuItem, MenuList } from "@mui/material"

const Sidebar = () => {
  return (
    <Drawer>
      <MenuList>
        <MenuItem>
          Busca
        </MenuItem>
        <MenuItem>
          Informações
        </MenuItem>
        <MenuItem>
          Como ajudra
        </MenuItem>
      </MenuList>
    </Drawer>
  )
}

export default Sidebar
