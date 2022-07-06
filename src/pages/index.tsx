import { useEffect, useRef, useState } from "react"
import type { NextPage } from 'next'
import Map from '../components/Map'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { MarkerOps } from "../utils/types/marker.type"

const Home: NextPage = () => {
  const [coordinates, setCoordinates] = useState({
    lat: -23.9692876,
    lng: -46.3892766,
  })
  const [markers, setMarkers] = useState<MarkerOps[]>([])
  const [searchedLocations, setSearchedLocations] = useState<google.maps.GeocoderResult[]>([]);
  console.log('searchedLocations', searchedLocations)
  return (
    <div className="flex flex-col min-h-screen">
      <Header setLocations={setSearchedLocations}/>
      <main className="flex flex-1">
        <Map coordinates={coordinates} setCoodinates={setCoordinates} markers={markers}/>
        <Sidebar locations={searchedLocations} />
      </main>
    </div>
  )
}

export default Home
