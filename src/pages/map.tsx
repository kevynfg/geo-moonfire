import React, { Suspense, useEffect, useState } from "react"
import type { NextPage } from 'next'
import { MarkerOps } from "../utils/types/marker.type"
import { LatLng } from "../utils/types/latlng.type"
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic';
import Loading from "@/components/Loading"
import { useRouter } from "next/router"

const Header = dynamic(() => import('../components/Header'), {
  ssr: false
})

const Sidebar = dynamic(() => import('../components/Sidebar'), {
  ssr: false
})

const Map = dynamic(() => import('../components/Map'), {
  ssr: false
})

const Home: NextPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  })
  const [markers, setMarkers] = useState<MarkerOps[]>([])
  const [searchedLocations, setSearchedLocations] = useState<google.maps.GeocoderResult[]>([]);
  const [newPlaceOnMap, setNewPlaceOnMap] = useState<LatLng>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (!data?.user || status.includes("unauthenticated")) {
      router.push("/login");
    }
  })

  if (!data?.user || status.includes("unauthenticated")) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">
        <Loading />
      </div>
    )
  }

  async function setNewLocationOnMap(lat: number, lng: number) {
        setNewPlaceOnMap({
          lat,
          lng,
        })
  }
  
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-h-screen">
        <Header setLocations={setSearchedLocations} newPlaceClickedOnMap={newPlaceOnMap} setNewMarkerBySearchBox={setCoordinates}/>
          <main className="flex flex-1">
            <Map coordinates={coordinates} setCoordinates={setCoordinates} markers={markers} findPlaceByMapClick={setNewLocationOnMap}/>
            <Sidebar locations={searchedLocations} setNewCoordinates={setCoordinates} />
          </main>
      </div>
    </Suspense>
  )
}

export default Home
