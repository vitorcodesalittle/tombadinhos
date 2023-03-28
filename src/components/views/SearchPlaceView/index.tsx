'use client'
import { EnrichedPlace } from "@/common";
import Map from "@/components/Map";
import messages from "@/pt-br";
import { Box, Button, CircularProgress, Grid, Paper, Stack } from "@mui/material";
import { ReactNode, Suspense, useEffect, useRef, useState } from "react";

interface SearchPlaceProps {
  children: ReactNode
  results: ReactNode
  places?: EnrichedPlace[]
}
const SearchPlaceView = (props: SearchPlaceProps) => {
  const { places } = props;
  const mapsRef = useRef<google.maps.Map | null>(null)
  const [searchExapanded, setSearchExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClickPlace = (place: EnrichedPlace) => {
    if (!mapsRef.current) {
      console.info('Skipping click action because no maps api')
      return
    }
    if (!place.location) {
      console.info('Skipping click action because no location')
      return
    }
    setSearchExpanded(false)
    mapsRef.current.panTo({
      lat: place.location.lat,
      lng: place.location.lon,
    })
  }

  const toggleSearchVisible = () => {
    setSearchExpanded(isExpanded => !isExpanded)
  }


  const [isXs, setIsXs] = useState(false)

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setIsXs(window.innerWidth < 900)
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  const height = !isXs ? '100vh' : searchExapanded ? '90vh' : 0;

  return (
    <Grid container ref={containerRef}>
      <Grid item xs={12} md={6} lg={4}>
        <Stack sx={{
          height,
          overflowY: 'scroll',
          flex: '1 1 100%',
          alignItems: 'flex-start',
          flexDirection: 'column',
          transition: 'height 0.3s ease-out'
        }}>
          <Box sx={{
            flex: '1 1',
            width: '80%',
            zIndex: 200,
            mt: 2,
            mb: 2,
            p: 4,
          }}>
            {props.children}
          </Box>
          {props.results}
        </Stack>
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        {isXs && <Button variant="outlined" sx={{ height: '10vh', width: '100%' }} onClick={toggleSearchVisible}>{searchExapanded ? messages.RETRACT_SEARCH : messages.EXPAND_SEARCH}</Button>}
        <Box sx={{ height: (isXs && searchExapanded) ? 0 : isXs ? '90vh' : '100vh', width: '100%' }}>
          <Suspense fallback={<CircularProgress />}>
            <Map places={places || []} onGoogleApiLoaded={({ map }) => {
              mapsRef.current = map
            }}
            />
          </Suspense>
        </Box>
      </Grid>
    </Grid>

  )

}
export default SearchPlaceView
