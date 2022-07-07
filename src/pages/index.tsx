import { useEffect, useRef, useState } from "react"
import type { NextPage } from 'next'
import Map from '../components/Map'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { MarkerOps } from "../utils/types/marker.type"
import { LatLng } from "../utils/types/latlng.type"

const Home: NextPage = () => {
  const [coordinates, setCoordinates] = useState({
    lat: -23.9692876,
    lng: -46.3892766,
  })
  const [markers, setMarkers] = useState<MarkerOps[]>([])
  const [searchedLocations, setSearchedLocations] = useState<google.maps.GeocoderResult[]>([]);
  const [newPlaceOnMap, setNewPlaceOnMap] = useState<LatLng>({
    lat: 0,
    lng: 0,
  });

  async function setNewLocationOnMap(lat: number, lng: number) {
        setNewPlaceOnMap({
          lat,
          lng,
        })
  }
  console.log('new place', newPlaceOnMap)
  console.log('coordinates changed', coordinates)
  return (
    <div className="flex flex-col min-h-screen">
      <Header setLocations={setSearchedLocations} newPlaceClickedOnMap={newPlaceOnMap} setNewMarkerBySearchBox={setCoordinates}/>
      <main className="flex flex-1">
        <Map coordinates={coordinates} setCoordinates={setCoordinates} markers={markers} findPlaceByMapClick={setNewLocationOnMap}/>
        <Sidebar locations={searchedLocations} setNewCoordinates={setCoordinates} />
      </main>
    </div>
  )
}

export default Home
