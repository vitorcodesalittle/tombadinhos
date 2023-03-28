'use client'
import  Chip  from "@mui/material/Chip"
import  Popover  from "@mui/material/Popover"
import  Typography  from "@mui/material/Typography"
import { ReactNode, useState, MouseEvent } from "react"
import { TypeOfProtection, ProtectionName } from "../../common"
import messages from '../../pt-br'

export interface InformationChipProps {
  label: string
  url?: string
  details?: string
  mode?: 'popover'
  color?: string
}

const InformationChip = (props: InformationChipProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return <div>
    <Chip label={props.label}

      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    />
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <Typography sx={{ p: 1 }}>{props.details}</Typography>
    </Popover>
  </div>

}

export const TypeOfProtecionChips: {
  [key in TypeOfProtection]: ReactNode
} = {
  district: <InformationChip label={messages['PROTECTION_TYPE:DISTRICT']} details={messages['DISTRICT_DETAILS']} />,
  state: <InformationChip label={messages['PROTECTION_TYPE:STATE']} details={messages['STATE_DETAILS']} />,
  national: <InformationChip label={messages['PROTECTION_TYPE:NATIONAL']} details={messages['NATIONAL_DETAILS']} />,
  humanity: <InformationChip label={messages['PROTECTION_TYPE:HUMAN']} details={messages['HUMAN_DETAILS']} />,
}


export const ProtectionChips: {
  [key in ProtectionName]: ReactNode
} = {
  IEP: <InformationChip label={"IEP"} details={messages["IEP_DETAILS"]} />,
}

export default InformationChip
