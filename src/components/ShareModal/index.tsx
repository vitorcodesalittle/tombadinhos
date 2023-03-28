'use client'
import  Modal  from "@mui/material/Modal"
import { EnrichedPlace } from "@/common"

export interface ShareModalProps {
  place: EnrichedPlace
  visible?: boolean
}
const ShareModal = (props: ShareModalProps) => {
  return <Modal open={props.visible || false} >
    <div>oi</div>
  </Modal>
}
export default ShareModal
