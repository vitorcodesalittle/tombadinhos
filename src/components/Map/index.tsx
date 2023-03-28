'use client'
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@mui/icons-material/Room';
import marcoZero from '../../common/const/marcoZero';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { EnrichedPlace } from '@/common';

interface AnyReactComponentProps {
  text: string
  lat: number
  lng: number
}

const ellipsis = (str: string, maxLength = 15): string => {
  if (str.length > maxLength) return str.substring(0, maxLength) + '...'
  return str
}

const AnyReactComponent = ({ text, }: AnyReactComponentProps) => <Box>
  <RoomIcon />
  <Typography>{text}</Typography>
</Box>;

interface GoogleMapStuff {
  maps: typeof google.maps
  map: google.maps.Map,
  ref: any
}
export interface MapProps {
  onGoogleApiLoaded?: ({ map, maps, ref }: GoogleMapStuff) => void
  places: EnrichedPlace[]
}
export default function Map(props: MapProps) {
  const { places } = props
  const defaultProps = {
    center: {
      lat: marcoZero.lat,
      lng: marcoZero.lon
    },
    zoom: 13
  };
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_API_STATIC_KEY || '' }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps, ref }) => props.onGoogleApiLoaded && props.onGoogleApiLoaded({ maps, map, ref })}
    >
      {places.filter(place => 'location' in place && place._id).map(place =>
        <AnyReactComponent
          key={place._id}
          lat={place.location!.lat}
          lng={place.location!.lon}
          text={ellipsis(place.name)}
        />)}
    </GoogleMapReact>
  );
}
